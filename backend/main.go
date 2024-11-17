package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/exp/slices"

	"time"

	"github.com/go-sql-driver/mysql"
)

type Sale struct {
	Id               int        `db:"id"`
	SaleId           int        `db:"sale_id"`
	ItemId           int        `db:"item_id"`
	RegisterPersonId int        `db:"register_person_id"`
	RegisteredAt     time.Time  `db:"registered_at"`
	IsCreated        bool       `db:"is_created"`
	CreatePersonId   *int       `db:"create_person_id"`
	CreatedAt        *time.Time `db:"created_at"`
	IsHandedOver     bool       `db:"is_handed_over"`
	HandOverPersonId *int       `db:"hand_over_person_id"`
	HandedOverAt     *time.Time `db:"handed_over_at"`
	IsCanceled       bool       `db:"is_canceled"`
	CancelPersonId   *int       `db:"cancel_person_id"`
	CanceledAt       *time.Time `db:"canceled_at"`
}

var db *sqlx.DB

type WaitingOrder struct {
	SaleId int       `json:"sale_id"`
	Time   time.Time `json:"time"`
}

type CallingOrder struct {
	SaleId int       `json:"sale_id"`
	Time   time.Time `json:"time"`
}

type AdminOrder struct {
	SaleId       int  `json:"sale_id"`
	ItemId       int  `json:"item_id"`
	IsCreated    bool `json:"is_created"`
	IsHandedOver bool `json:"is_handed_over"`
}

type AdminUpdate struct {
	SaleId int    `json:"sale_id"`
	Kind   string `json:"kind"`
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
	e.Use(middleware.CORS())

	// Routes
	e.GET("/", hello)
	e.GET("/waiting-orders", waiting_orders_handler)
	e.GET("/calling-orders", calling_orders_handler)
	// Admin
	e.GET("/admin-orders", get_admin_orders_handler)
	e.PUT("/admin-orders", put_admin_orders_handler)

	// Database
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		log.Printf("jst get error %s", err)
	}

	mysql_root_password := os.Getenv("MYSQL_ROOT_PASSWORD")
	log.Printf("mysql root password: %s", mysql_root_password)
	cfg := mysql.Config{
		DBName:               "coffee_dog",
		User:                 "root",
		Passwd:               mysql_root_password,
		Addr:                 fmt.Sprintf("%s:3306", mysql_host),
		Net:                  "tcp",
		ParseTime:            true,
		AllowNativePasswords: true,
		Collation:            "utf8mb4_unicode_ci",
		Loc:                  jst,
	}

	log.Printf("%s", cfg.FormatDSN())
	db, err = sqlx.Open("mysql", cfg.FormatDSN())
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
	sales_ids := []int{}
	for _, sale := range sales {
		sales_ids = append(sales_ids, sale.SaleId)
		log.Printf("%v", sale)
	}

	log.Printf("%v", sales_ids)
	e.Logger.Fatal(e.Start(server_port))
}

// Handler
func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

// Handler
func waiting_orders_handler(c echo.Context) error {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT * FROM sales WHERE NOT is_created AND NOT is_canceled;`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
	waiting_orders := []WaitingOrder{}
	for _, sale := range sales {
		waiting_orders = append(waiting_orders, WaitingOrder{
			SaleId: sale.SaleId,
			Time:   sale.RegisteredAt,
		})
	}
	// debug
	// c.Response().Header().Set(echo.HeaderAccessControlAllowOrigin, "*")
	return c.JSON(http.StatusOK, waiting_orders)
}

func calling_orders_handler(c echo.Context) error {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT * FROM sales WHERE is_created AND NOT is_handed_over AND NOT is_canceled;`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
	calling_orders := []CallingOrder{}
	for _, sale := range sales {
		calling_orders = append(calling_orders, CallingOrder{
			SaleId: sale.SaleId,
			Time:   sale.RegisteredAt,
		})
	}
	return c.JSON(http.StatusOK, calling_orders)
}

func get_admin_orders_handler(c echo.Context) error {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT * FROM sales WHERE NOT is_canceled;`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
	admin_orders := []AdminOrder{}
	saleIds := []int{}
	for _, sale := range sales {
		if slices.Contains(saleIds, sale.SaleId) {
			log.Printf("duplicate %d", sale.SaleId)
			continue
		}
		saleIds = append(saleIds, sale.SaleId)
		admin_orders = append(admin_orders, AdminOrder{
			SaleId:       sale.SaleId,
			ItemId:       sale.ItemId,
			IsCreated:    sale.IsCreated,
			IsHandedOver: sale.IsHandedOver,
		})
	}
	return c.JSON(http.StatusOK, admin_orders)
}

func put_admin_orders_handler(c echo.Context) error {
	admin_update := new(AdminUpdate)
	err := c.Bind(admin_update)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}
	log.Printf("%v", admin_update)
	return c.String(http.StatusOK, "Success")
}
