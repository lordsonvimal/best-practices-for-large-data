package userSkinny

import (
	"time"

	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/db"
)

type User struct {
	Id          int       `json:"id"`
	CreatedAt   time.Time `json:"-"`
	UpdatedAt   time.Time `json:"-"`
	FirstName   string    `json:"first_name" csv:"First Name"` // .csv column headers
	LastName    string    `json:"last_name" csv:"Last Name"`
	Sex         string    `json:"-" csv:"Sex"`
	Email       string    `json:"email" csv:"Email"`
	Phone       string    `json:"-" csv:"Phone"`
	DateOfBirth string    `json:"-" csv:"Date of birth"`
	JobTitle    string    `json:"job_title" csv:"Job Title"`
}

type Users struct {
	Users []User `json:"users"`
}

func GetUsers(table string) (Users, error) {
	sqlStatement := "SELECT id, email, first_name, last_name, job_title FROM " + table
	db := db.GetDB()
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return Users{}, err
	}
	defer rows.Close()
	result := Users{}

	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.Id, &user.Email, &user.FirstName, &user.LastName, &user.JobTitle)

		if err != nil {
			return Users{}, err
		}

		result.Users = append(result.Users, user)
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
