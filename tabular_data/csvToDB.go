package main

import (
	"os"

	"github.com/gocarina/gocsv"
)

type CSVToDB struct {
	FirstName   string `csv:"First Name"` // .csv column headers
	LastName    string `csv:"Last Name"`
	Sex         string `csv:"Sex"`
	Email       string `csv:"Email"`
	Phone       string `csv:"Phone"`
	DateOfBirth string `csv:"Date of birth"`
	JobTitle    string `csv:"Job Title"`
}

func CreateRecordsFromCSV(path string) {
	in, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer in.Close()

	clients := []*CSVToDB{}

	if err := gocsv.UnmarshalFile(in, &clients); err != nil {
		panic(err)
	}
}
