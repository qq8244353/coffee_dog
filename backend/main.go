package main

import (
	"log"
	"net/http"
	"os"
  "fmt"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/go-sql-driver/mysql"
	"time"
)

type Sale struct {
	SaleId           int       `db:"sale_id"`
	ItemId           int       `db:"item_id"`
	RegisterPersonId int       `db:"register_person_id"`
	RegisteredAt     time.Time `db:"registered_at"`
	IsHandedOver     bool      `db:"is_handed_over"`
	HandOverPersonId *int       `db:"hand_over_person_id"`
	HandedOverAt     *time.Time `db:"handed_over_at"`
	IsCanceled       bool      `db:"is_canceled"`
	CancelPersonId   *int       `db:"cancel_person_id"`
	CanceledAt       *time.Time `db:"canceled_at"`
}

type WaitingOrder struct {
	SaleId           int       `json:"sale_id"`
	time             time.Time `json:"time"`
}

type CallingOrder struct {
	SaleId           int       `json:"sale_id"`
	time             time.Time `json:"time"`
}

func main() {
  _, dev := os.LookupEnv("DEV")
  var mysql_host, server_port string
  if dev {
    // dev
    server_port = ":1324"
    mysql_host = "127.0.0.1"
  } else {
    // prod
    server_port = ":1323"
    mysql_host = "mysql_host"
  }
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", hello)
  e.GET("/waiting-orders", waiting_orders)
  e.GET("/calling-orders", calling_orders)


  // Database
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		log.Printf("jst get error %s", err)
	}

	mysql_root_password := os.Getenv("MYSQL_ROOT_PASSWORD")
  log.Printf("mysql root password: %s", mysql_root_password)
	cfg := mysql.Config{
		DBName:    "coffee_dog",
		User:      "root",
		Passwd:    mysql_root_password,
		Addr:      fmt.Sprintf("%s:3306", mysql_host),
		Net:       "tcp",
		ParseTime: true,
    AllowNativePasswords: true,
		Collation: "utf8mb4_unicode_ci",
		Loc:       jst,
	}

  log.Printf("%s", cfg.FormatDSN())
	db, err := sqlx.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
  // mysqlの起動を待つ
  for {
		err := db.Ping()
		if err == nil {
			break
		}
		log.Print(err)
		time.Sleep(time.Second * 2)
	}

	var sales []Sale
	err = db.Select(&sales, `SELECT * FROM sales;`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
  for _, sale := range sales {
    log.Printf("%v", sale)
  }
  e.Logger.Fatal(e.Start(server_port))
}

// Handler
func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

// Handler
func waiting_orders(c echo.Context) error {
	return c.JSON(http.StatusOK, "Hello, World!")
}

func calling_orders(c echo.Context) error {
	return c.JSON(http.StatusOK, "Hello, World!")
}
