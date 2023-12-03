package userArrays

import (
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/db"
)

type Users struct {
	Users [][]string `json:"users"`
}

var (
	container []string
	pointers  []interface{}
)

func GetUsers(table string) (Users, error) {
	sqlStatement := "SELECT id, first_name, last_name, email, job_title FROM " + table
	db := db.GetDB()
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return Users{}, err
	}
	defer rows.Close()
	result := Users{}

	length := 5
	for rows.Next() {
		pointers = make([]interface{}, length)
		container = make([]string, length)

		for i := range pointers {
			pointers[i] = &container[i]
		}

		err := rows.Scan(pointers...)

		if err != nil {
			return Users{}, err
		}

		result.Users = append(result.Users, container)
	}

	return result, nil
}

func GetUsers1K() (Users, error) {
	return GetUsers("user_1k")
}

func GetUsers10K() (Users, error) {
	return GetUsers("user_10k")
}

func GetUsers2M() (Users, error) {
	return GetUsers("user_2m")
}

func GetUsers100K() (Users, error) {
	return GetUsers("user_100k")
}
