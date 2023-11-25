package main

import (
	"io"
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type MessageResponse struct {
	Msg string `json:"msg" xml:"msg"`
}

func hello(c echo.Context) error {
	msg := MessageResponse{
		Msg: "test",
	}
	return c.JSON(http.StatusOK, &msg)
}

func upload(c echo.Context) error {
	c.Response().Writer.Header().Set("Access-Control-Allow_origin", "*")
	//-----------
	// Read file
	//-----------

	// Source
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Destination
	dst, err := os.Create(file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	r := MessageResponse{
		Msg: "Successfully uploaded file",
	}

	log.Println("sending json")
	return c.JSON(http.StatusOK, r)
}

func main() {
	e := echo.New()

	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.GzipWithConfig(middleware.DefaultGzipConfig))

	e.POST("/upload", upload)
	e.GET("/hello", hello)

	e.Logger.Fatal(e.Start(":1323"))
}
