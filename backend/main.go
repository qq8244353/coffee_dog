package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

  "time"
)

type Sales struct {
  SaleId           int       `db:sale_id`
  ItemId           int       `db:item_id`
  RegisterPersonId int       `db:register_person_id`
  RegisteredAt     time.Time `db:registered_at`
  IsHandedOver     bool      `db:is_handed_over`
  HandOverPersonId int       `db:hand_over_person_id`
  HandedOverAt     time.Time `db:handed_over_at`
  IsCanceled       bool      `db:is_canceled`
  CancelPersonId   int       `db:cancel_person_id`
  CanceledAt       time.Time `db:canceled_at`
}

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", hello)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

// Handler
func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}
