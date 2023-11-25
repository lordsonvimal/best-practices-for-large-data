package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type MessageResponse struct {
	Msg string `json:"msg" xml:"msg"`
}

func get_1k_records(c echo.Context) error {
	r := MessageResponse{
		Msg: "Successfully sent 1k records",
	}

	log.Println("sending json")
	return c.JSON(http.StatusOK, r)
}

func main() {
	e := echo.New()

	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	// e.Use(middleware.GzipWithConfig(middleware.DefaultGzipConfig))

	e.POST("/get_1k_records", get_1k_records)
	CreateRecordsFromCSV("../assets/people-1000.csv")

	e.Logger.Fatal(e.Start(":1324"))

}
