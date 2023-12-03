package main

import (
	"net/http"
	_ "net/http/pprof"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/db"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/UserArrayOptimize"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/UserObjectOptimize"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/UserServer"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/user"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/userArrays"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/src/userSkinny"
)

type MessageResponse struct {
	Msg string `json:"msg" xml:"msg"`
}

// Default
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

// Object optimized
func get_1k_records_object_optimized(c echo.Context) error {
	res, err := UserObjectOptimize.GetUsers1K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_10k_records_object_optimized(c echo.Context) error {
	res, err := UserObjectOptimize.GetUsers10K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_100k_records_object_optimized(c echo.Context) error {
	res, err := UserObjectOptimize.GetUsers100K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_2m_records_object_optimized(c echo.Context) error {
	res, err := UserObjectOptimize.GetUsers2M()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

// Array optimized
func get_1k_records_array_optimized(c echo.Context) error {
	res, err := UserArrayOptimize.GetUsers1K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_10k_records_array_optimized(c echo.Context) error {
	res, err := UserArrayOptimize.GetUsers10K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_100k_records_array_optimized(c echo.Context) error {
	res, err := UserArrayOptimize.GetUsers100K()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_2m_records_array_optimized(c echo.Context) error {
	res, err := UserArrayOptimize.GetUsers2M()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

// Server optimized
func get_1k_records_server_optimized(c echo.Context) error {
	res, err := UserServer.GetUsers1K(c)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_10k_records_server_optimized(c echo.Context) error {
	res, err := UserServer.GetUsers10K(c)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_100k_records_server_optimized(c echo.Context) error {
	res, err := UserServer.GetUsers100K(c)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, &MessageResponse{Msg: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func get_2m_records_server_optimized(c echo.Context) error {
	res, err := UserServer.GetUsers2M(c)

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
	e.GET("/get_1k_records_object_optimized", get_1k_records_object_optimized)
	e.GET("/get_10k_records_object_optimized", get_10k_records_object_optimized)
	e.GET("/get_100k_records_object_optimized", get_100k_records_object_optimized)
	e.GET("/get_2m_records_object_optimized", get_2m_records_object_optimized)
	e.GET("/get_1k_records_array_optimized", get_1k_records_array_optimized)
	e.GET("/get_10k_records_array_optimized", get_10k_records_array_optimized)
	e.GET("/get_100k_records_array_optimized", get_100k_records_array_optimized)
	e.GET("/get_2m_records_array_optimized", get_2m_records_array_optimized)
	e.GET("/get_1k_records_server_optimized", get_1k_records_server_optimized)
	e.GET("/get_10k_records_server_optimized", get_10k_records_server_optimized)
	e.GET("/get_100k_records_server_optimized", get_100k_records_server_optimized)
	e.GET("/get_2m_records_server_optimized", get_2m_records_server_optimized)

	// Dont go live with the following
	// http://127.0.0.1:1324/debug/pprof/
	// e.GET("/debug/*", echo.WrapHandler(http.DefaultServeMux))

	db.InitDB()

	e.Logger.Fatal(e.Start(":1324"))

}
