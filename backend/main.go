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
  // JOIN
	RecieveId        int        `db:"recieve_id"`
}

// type RecieveId struct {
//   Id               int        `db:"id", json:"id"`
//   Available        bool       `db:"available", json:"available"`
//   UpdatedAt        *time.Time `db:"updated_at", json:"updated_at"`
//   SaleId           int        `db:"sale_id", json:"sale_id"`
// }

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
var timeLayout = "2006-01-02 15:04:05 (MST)"

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
  RecieveId    int         `json:"recieve_id"`
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

type CntSaleId struct {
	Id int `db:"COUNT(sale_id)"`
}

type RecieveId struct {
	Id int `db:"id"`
}


type ViewOrder struct {
	SaleId     int         `json:"sale_id"`
	Items      []OrderItem `json:"items"`
	Time       time.Time   `json:"time"`
  RecieveId  int         `json:"recieve_id"`
}

type MessageJson struct {
	Message    string   `json:"message"`
}

type GraphData struct {
  HotCoffee  int    `json:"hot_coffee"`
  IceCoffee  int    `json:"ice_coffee"`
  Lemonade   int    `json:"lemonade"`
  Madeleine  int    `json:"madeleine"`
  Chocolat   int    `json:"chocolat"`
  Journal    int    `json:"journal"`
  Option     int    `json:"option"`
  Time       string `json:"time"`
}

func main() {
  os.Setenv("TZ", "Asia/Tokyo")
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
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
    AllowOrigins: []string{},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	// Routes
	e.GET("/", hello)
	e.GET("/waiting-orders", waiting_orders_handler)
	e.GET("/calling-orders", calling_orders_handler)
	e.GET("/graph-data-day1", get_graph_data_day1)
	e.GET("/graph-data-day2", get_graph_data_day2)
	// e.GET("/recieve-numbers", recieve_numbers)
	// Admin
	e.GET("/admin-all-orders", get_admin_all_orders_handler)
	e.GET("/admin-orders", get_admin_orders_handler)
	e.PUT("/admin-orders", put_admin_orders_handler)
	e.POST("/admin-orders", post_admin_orders_handler)

	// Database
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		log.Printf("jst get error %s", err)
	}

	mysql_root_password := os.Getenv("MYSQL_ROOT_PASSWORD")
	// log.Printf("mysql root password: %s", mysql_root_password)
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
	err := db.Select(&sales, `SELECT S.sale_id, S.registered_at, S.created_at, S.item_id, R.id AS recieve_id FROM sales AS S INNER JOIN recieve_ids AS R ON S.sale_id - R.sale_id WHERE NOT is_created AND NOT is_canceled`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
	return c.JSON(http.StatusOK, buildViewOrder(sales, "waiting"))
}

func calling_orders_handler(c echo.Context) error {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT S.sale_id, S.registered_at, S.created_at, S.item_id, R.id AS recieve_id FROM sales AS S INNER JOIN recieve_ids AS R ON S.sale_id - R.sale_id WHERE  is_created AND NOT is_handed_over AND NOT is_canceled;`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
	return c.JSON(http.StatusOK, buildViewOrder(sales, "calling"))
}

// util
func buildViewOrder(sales []Sale, method string) []ViewOrder {
  // recieve numbers
	timeMap := make(map[int]time.Time)
  recieveIdMap := make(map[int]int)
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
    recieveIdMap[sale.SaleId] = sale.RecieveId
	}
  var viewOrders = []ViewOrder{}
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
			SaleId:        saleId,
			Items:         orderItems,
			Time:          timeMap[saleId],
      RecieveId:     recieveIdMap[saleId],
		})
	}
	return viewOrders
}

func get_admin_all_orders_handler(c echo.Context) error {
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
  for i, _ := range adminOrders {
    adminOrders[i].Index = i
  }
	return c.JSON(http.StatusOK, adminOrders)
}

func get_admin_orders_handler(c echo.Context) error {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT S.sale_id, S.item_id, S.registered_at, S.is_created, S.is_handed_over, R.id AS recieve_id FROM sales AS S INNER JOIN recieve_ids AS R ON S.sale_id = R.sale_id;`)
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
			RecieveId:    saleMap[saleId].RecieveId,
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
  for i, _ := range adminOrders {
    adminOrders[i].Index = i
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
	timeNowStr := time.Now().Format("2006-01-02 15:04:05")
	var res sql.Result
	if admin_update.Kind == "created" {
		res, err = db.Exec(`UPDATE sales SET is_created = TRUE, created_at = ? WHERE sale_id = ?`, timeNowStr, admin_update.SaleId)
		if err != nil {
			log.Printf("%s", err)
			return c.String(http.StatusInternalServerError, "internal server error")
		}
	} else if admin_update.Kind == "handed over" {
    // sales
		res, err = db.Exec(`UPDATE sales SET is_handed_over = TRUE, handed_over_at = ? WHERE sale_id = ?`, timeNowStr, admin_update.SaleId)
		if err != nil {
			log.Printf("%s", err)
			return c.String(http.StatusInternalServerError, "internal server error")
		}
    // recieve_ids
		res, err = db.Exec(`UPDATE recieve_ids SET sale_id = NULL, available = TRUE, updated_at = ? WHERE sale_id = ?`, timeNowStr, admin_update.SaleId)
		if err != nil {
			log.Printf("%s", err)
			return c.String(http.StatusInternalServerError, "internal server error")
		}
	} else if admin_update.Kind == "canceled" {
    // sales
		res, err = db.Exec(`UPDATE sales SET is_canceled = TRUE, canceled_at = ? WHERE sale_id = ?`, timeNowStr, admin_update.SaleId)
		if err != nil {
			log.Printf("%s", err)
			return c.JSON(http.StatusInternalServerError, "internal server error")
		}
    // recieve_ids
		res, err = db.Exec(`UPDATE recieve_ids SET sale_id = NULL, available = TRUE, updated_at = ? WHERE sale_id = ?`, timeNowStr, admin_update.SaleId)
		if err != nil {
			log.Printf("%s", err)
			return c.String(http.StatusInternalServerError, "internal server error")
		}
	}
  _ = res
  return c.JSON(http.StatusOK, MessageJson{ Message: "Success" })
}

func post_admin_orders_handler(c echo.Context) error {
	// bind payload
	adminPost := new(AdminPost)
	err := c.Bind(adminPost)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}
	// get sale id
  var maxSaleIds = MaxSaleId{}
  err = db.Get(&maxSaleIds, `SELECT MAX(sale_id) FROM sales`)
	if err != nil {
    log.Printf("couldn't select max: %s", err)
    var cntSaleIds = CntSaleId{}
    err = db.Get(&cntSaleIds, `SELECT COUNT(sale_id) FROM sales`)
    if err != nil {
      log.Printf("couldn't select cnt: %s", err)
      return c.String(http.StatusInternalServerError, "internal server error")
    }
    if cntSaleIds.Id != 0 {
      log.Println("cnt is not zero")
      return c.String(http.StatusInternalServerError, "internal server error")
    }
	}
  var bestRecieveId = RecieveId{}
  err = db.Get(&bestRecieveId, `SELECT id FROM recieve_ids WHERE available ORDER BY updated_at LIMIT 1`)
  if err != nil {
    log.Printf("couldn't select recieveId: %s", err)
    return c.String(http.StatusInternalServerError, "internal server error")
  }
  recieveId := bestRecieveId.Id
  saleId := maxSaleIds.Id + 1
  log.Printf("recieveId, saleId: %s, %s", recieveId, saleId)
  log.Println("hello")
	// common column
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
  _, err = db.Exec(`UPDATE recieve_ids SET available = FALSE, sale_id = ? WHERE id = ?`, saleId, recieveId)
  if err != nil {
    log.Printf("%s", err)
    return c.String(http.StatusInternalServerError, "internal server error")
  }

	_, err = db.NamedExec(sql, sales)
	if err != nil {
		log.Printf("%s", err)
		return c.String(http.StatusInternalServerError, "internal server error")
	}
  return c.JSON(http.StatusOK, MessageJson{ Message: fmt.Sprintf("%d", recieveId) })
}

func get_graph_data_day1(c echo.Context) error {
  res, err := get_graph_data(c, 3)
  if err != nil {
    return err
  }
  return c.JSON(http.StatusOK, res)
}

func get_graph_data_day2(c echo.Context) error {
  res, err := get_graph_data(c, 4)
  if err != nil {
    return err
  }
  return c.JSON(http.StatusOK, res)
}

func get_graph_data(c echo.Context, day int) ([]GraphData, error) {
	var sales []Sale
	// registered は True である
	err := db.Select(&sales, `SELECT * FROM sales WHERE NOT is_canceled`)
	if err != nil {
		log.Printf("sql.Open error %s", err)
	}
  sort.Slice(sales, func(i, j int) bool {
    return sales[i].RegisteredAt.Before(sales[j].RegisteredAt)
  })
  var graphDataList = []GraphData{}
  timeNow, err := time.Parse(timeLayout, fmt.Sprintf("2024-11-2%d 10:00:00 (JST)", day))
  if err != nil {
    log.Printf("time parse error: %s", err)
  }
  timeEnd, err := time.Parse(timeLayout, fmt.Sprintf("2024-11-2%d 17:00:00 (JST)", day))
  if err != nil {
    log.Printf("time parse error: %s", err)
  }
  ind := 0
  for ind < len(sales) && sales[ind].RegisteredAt.Before(timeNow) {
    ind++
  }
  timeNow = timeNow.Add(time.Minute * 30)
  for timeNow.Before(timeEnd) {
    g := GraphData{}
    for ind < len(sales) && sales[ind].RegisteredAt.Before(timeNow) {
      if sales[ind].ItemId == 10 {
        g.HotCoffee++
      } else if sales[ind].ItemId == 11 {
        g.IceCoffee++
      } else if sales[ind].ItemId == 12 {
        g.HotCoffee++
        g.Option++
      } else if sales[ind].ItemId == 13 {
        g.IceCoffee++
        g.Option++
      } else if sales[ind].ItemId == 20 {
        g.Lemonade++
      } else if sales[ind].ItemId == 30 {
        g.Madeleine++
      } else if sales[ind].ItemId == 31 {
        g.Chocolat++
      } else if sales[ind].ItemId == 41 {
        g.Journal++
      }
      ind++
    }
    g.Time += fmt.Sprintf("-%02d:%02d", timeNow.Hour(), timeNow.Minute())
    timeNow = timeNow.Add(time.Minute * 30)
    graphDataList = append(graphDataList, g)
  }
  return graphDataList, nil
}
