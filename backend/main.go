package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
  "sort"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

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

type RecieveNumber struct {
  Id               int        `db:"id", json:"id"`
  Available        bool       `db:"available", json:"available"`
  UpdatedAt        *time.Time `db:"updated_at", json:"updated_at"`
}

var db *sqlx.DB
var itemNameMap = map[int]string{
  10: "ホットコーヒー", 
  11: "アイスコーヒー", 
  12: "ホットコーヒー + オプション", 
  13: "アイスコーヒー + オプション", 
  20: "レモネード",
  30: "メープルマドレーヌ",
  31: "アマンドショコラ",
  41: "部紙",
}
var timeLayout = "2006-01-02 15:04:05"

type OrderItem struct {
	ItemId   int    `json:"item_id"`
	ItemName string `json:"item_name"`
	Cnt      int    `json:"cnt"`
}

// get
type AdminOrder struct {
	SaleId       int         `json:"sale_id"`
	Items        []OrderItem `json:"items"`
	Time         time.Time   `json:"time"`
	IsCreated    bool        `json:"is_created"`
	IsHandedOver bool        `json:"is_handed_over"`
  Index        int         `json:"index"`
}

// put
type AdminUpdate struct {
	SaleId int    `json:"sale_id"`
	Kind   string `json:"kind"`
}

// post
type AdminPost struct {
	Items            []OrderItem `json:"items"`
	RegisterPersonId int         `json:"register_person_id"`
}

type MaxSaleId struct {
	Id int `db:"MAX(sale_id)"`
}

type ViewOrder struct {
	SaleId int         `json:"sale_id"`
	Items  []OrderItem `json:"items"`
	Time   time.Time   `json:"time"`
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
	e.GET("/recieve-numbers", recieve_numbers)
	// Admin
	e.GET("/admin-orders", get_admin_orders_handler)
	e.PUT("/admin-orders", put_admin_orders_handler)
	e.POST("/admin-orders", post_admin_orders_handler)

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

func recieve_numbers(c echo.Context) error {
	var recieveNumbers[]RecieveNumber
	// registered は True である
	err := db.Select(&recieveNumbers, `SELECT * FROM recieve_nums`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
  log.Printf("%+v", recieveNumbers)
	return c.JSON(http.StatusOK, recieveNumbers)
}

// Handler
func waiting_orders_handler(c echo.Context) error {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT * FROM sales WHERE NOT is_created AND NOT is_canceled`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
	return c.JSON(http.StatusOK, buildViewOrder(sales, "waiting"))
}

func calling_orders_handler(c echo.Context) error {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT * FROM sales WHERE is_created AND NOT is_handed_over AND NOT is_canceled;`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
	return c.JSON(http.StatusOK, buildViewOrder(sales, "calling"))
}

// util
func buildViewOrder(sales []Sale, method string) []ViewOrder {
	timeMap := make(map[int]time.Time)
	cntMap := make(map[int]map[int]int)
	for _, sale := range sales {
		if method == "waiting" {
			timeMap[sale.SaleId] = sale.RegisteredAt
		} else if method == "calling" {
			if sale.CreatedAt == nil {
				log.Printf("nil createdAt: %+v", sale)
				continue
			}
			timeMap[sale.SaleId] = *sale.CreatedAt
		}
		_, ok := cntMap[sale.SaleId]
		if !ok {
			cntMap[sale.SaleId] = make(map[int]int)
		}
		cntMap[sale.SaleId][sale.ItemId]++
	}
	var viewOrders []ViewOrder
	for saleId, m := range cntMap {
		var orderItems []OrderItem
		for itemId, cnt := range m {
			orderItems = append(orderItems, OrderItem{
				ItemId: itemId,
        ItemName: itemNameMap[itemId],
				Cnt:    cnt,
			})
		}
		viewOrders = append(viewOrders, ViewOrder{
			SaleId: saleId,
			Items:  orderItems,
			Time:   timeMap[saleId],
		})
	}
	return viewOrders
}

func get_admin_orders_handler(c echo.Context) error {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT * FROM sales WHERE NOT is_canceled;`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
	adminOrders := []AdminOrder{}
	saleMap := make(map[int]Sale)
	cntMap := make(map[int]map[int]int)
	for _, sale := range sales {
		saleMap[sale.SaleId] = sale
		_, ok := cntMap[sale.SaleId]
		if !ok {
			cntMap[sale.SaleId] = make(map[int]int)
		}
		cntMap[sale.SaleId][sale.ItemId]++
	}
	for saleId, m := range cntMap {
		var orderItems []OrderItem
		for itemId, cnt := range m {
			orderItems = append(orderItems, OrderItem{
				ItemId: itemId,
        ItemName: itemNameMap[itemId],
				Cnt:    cnt,
			})
		}
		adminOrders = append(adminOrders, AdminOrder{
			SaleId:       saleId,
			Items:        orderItems,
			Time:         saleMap[saleId].RegisteredAt,
			IsCreated:    saleMap[saleId].IsCreated,
			IsHandedOver: saleMap[saleId].IsHandedOver,
		})
	}
  sort.Slice(adminOrders, func(i, j int) bool {
    rank := func(a AdminOrder) int {
      if a.IsHandedOver {
        return 100
      } else if a.IsCreated {
        return 10
      } else {
        return 0
      }
    }
    irank := rank(adminOrders[i])
    jrank := rank(adminOrders[j])
    if irank == jrank {
      return adminOrders[i].Time.After(adminOrders[j].Time)
    }
    return irank < jrank
  })
  for i, order := range adminOrders {
    order.Index = i
  }
  log.Printf("%+v", adminOrders)
	return c.JSON(http.StatusOK, adminOrders)
}

func put_admin_orders_handler(c echo.Context) error {
	admin_update := new(AdminUpdate)
	err := c.Bind(admin_update)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}
	log.Printf("%d", admin_update.SaleId)
	log.Printf("%s", admin_update.Kind)

	timeNowStr := time.Now().Format("2006-01-02 15:04:05")
	var res sql.Result
	if admin_update.Kind == "created" {
		res, err = db.Exec(`UPDATE sales SET is_created = TRUE, created_at = ? WHERE sale_id = ?`, timeNowStr, admin_update.SaleId)
		if err != nil {
			log.Printf("%s", err)
			return c.String(http.StatusInternalServerError, "internal server error")
		}
	} else if admin_update.Kind == "handed over" {
		res, err = db.Exec(`UPDATE sales SET is_handed_over = TRUE, handed_over_at = ? WHERE sale_id = ?`, timeNowStr, admin_update.SaleId)
		if err != nil {
			log.Printf("%s", err)
			return c.String(http.StatusInternalServerError, "internal server error")
		}
	} else if admin_update.Kind == "canceled" {
		res, err = db.Exec(`UPDATE sales SET is_canceled = TRUE, canceled_at = ? WHERE sale_id = ?`, timeNowStr, admin_update.SaleId)
		if err != nil {
			log.Printf("%s", err)
			return c.String(http.StatusInternalServerError, "internal server error")
		}
	}
	log.Printf("%v", res)
	return c.String(http.StatusOK, "Success")
}

func post_admin_orders_handler(c echo.Context) error {
	// bind payload
	adminPost := new(AdminPost)
	err := c.Bind(adminPost)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}
	// get sale id
	var maxSaleId MaxSaleId
	err = db.Get(&maxSaleId, `SELECT MAX(sale_id) FROM sales`)
	if err != nil {
		log.Printf("couldn't select max %s", err)
		return c.String(http.StatusInternalServerError, "internal server error")
	}
	log.Printf("%+v", maxSaleId)
	// common column
	saleId := maxSaleId.Id + 1
	timeNow := time.Now()
	var sales []Sale
	sql := `INSERT INTO sales (sale_id, item_id, register_person_id, registered_at) VALUES (:sale_id, :item_id, :register_person_id, :registered_at)`
	for _, item := range adminPost.Items {
		for _ = range item.Cnt {
			sales = append(sales, Sale{
				SaleId:           saleId,
				ItemId:           item.ItemId,
				RegisterPersonId: adminPost.RegisterPersonId,
				RegisteredAt:     timeNow,
			})
		}
	}
	_, err = db.NamedExec(sql, sales)
	if err != nil {
		log.Printf("%s", err)
		return c.String(http.StatusInternalServerError, "internal server error")
	}
	return c.String(http.StatusOK, fmt.Sprintf("%d", saleId))
}
