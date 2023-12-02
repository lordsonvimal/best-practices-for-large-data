package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/db"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/user"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/userArrays"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/userSkinny"
)

type MessageResponse struct {
	Msg string `json:"msg" xml:"msg"`
}

func get_1k_records_default(c echo.Context) error {
	res, err := user.GetUsers1K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_10k_records_default(c echo.Context) error {
	res, err := user.GetUsers10K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_100k_records_default(c echo.Context) error {
	res, err := user.GetUsers100K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_2m_records_default(c echo.Context) error {
	res, err := user.GetUsers2M()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_1k_records_skinny(c echo.Context) error {
	res, err := userSkinny.GetUsers1K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_10k_records_skinny(c echo.Context) error {
	res, err := userSkinny.GetUsers10K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_100k_records_skinny(c echo.Context) error {
	res, err := userSkinny.GetUsers100K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_2m_records_skinny(c echo.Context) error {
	res, err := userSkinny.GetUsers2M()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

// Array response
func get_1k_records_array(c echo.Context) error {
	res, err := userArrays.GetUsers1K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_10k_records_array(c echo.Context) error {
	res, err := userArrays.GetUsers10K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_100k_records_array(c echo.Context) error {
	res, err := userArrays.GetUsers100K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_2m_records_array(c echo.Context) error {
	res, err := userArrays.GetUsers2M()

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

	e.GET("/get_1k_records_default", get_1k_records_default)
	e.GET("/get_10k_records_default", get_10k_records_default)
	e.GET("/get_100k_records_default", get_100k_records_default)
	e.GET("/get_2m_records_default", get_2m_records_default)
	e.GET("/get_1k_records_skinny", get_1k_records_skinny)
	e.GET("/get_10k_records_skinny", get_10k_records_skinny)
	e.GET("/get_100k_records_skinny", get_100k_records_skinny)
	e.GET("/get_2m_records_skinny", get_2m_records_skinny)
	e.GET("/get_1k_records_array", get_1k_records_array)
	e.GET("/get_10k_records_array", get_10k_records_array)
	e.GET("/get_100k_records_array", get_100k_records_array)
	e.GET("/get_2m_records_array", get_2m_records_array)

	db.InitDB()

	e.Logger.Fatal(e.Start(":1324"))

}
