package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/db"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/user"
)

type MessageResponse struct {
	Msg string `json:"msg" xml:"msg"`
}

func get_1k_records(c echo.Context) error {
	res, err := user.GetUsers1K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_10k_records(c echo.Context) error {
	res, err := user.GetUsers10K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_100k_records(c echo.Context) error {
	res, err := user.GetUsers100K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_2m_records(c echo.Context) error {
	res, err := user.GetUsers2M()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func main() {
	e := echo.New()

	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	// e.Use(middleware.GzipWithConfig(middleware.DefaultGzipConfig))

	e.GET("/get_1k_records", get_1k_records)
	e.GET("/get_10k_records", get_10k_records)
	e.GET("/get_100k_records", get_100k_records)
	e.GET("/get_2m_records", get_2m_records)

	db.InitDB()

	e.Logger.Fatal(e.Start(":1324"))

}
