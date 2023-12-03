package UserArrayOptimize

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
	sqlStatement := "SELECT id, name, email, job_title FROM " + table
	db := db.GetDB()
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return Users{}, err
	}
	defer rows.Close()
	result := Users{}

	length := 4
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
	return GetUsers("user_1k_optimized")
}

func GetUsers10K() (Users, error) {
	return GetUsers("user_10k_optimized")
}

func GetUsers2M() (Users, error) {
	return GetUsers("user_2m_optimized")
}

func GetUsers100K() (Users, error) {
	return GetUsers("user_100k_optimized")
}
