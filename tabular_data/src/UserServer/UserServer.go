package UserServer

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/db"
)

type User struct {
	Id          int       `json:"id"`
	CreatedAt   time.Time `json:"-"`
	UpdatedAt   time.Time `json:"-"`
	Name        string    `json:"name" csv:"First Name"` // .csv column headers
	Sex         string    `json:"-" csv:"Sex"`
	Email       string    `json:"email" csv:"Email"`
	Phone       string    `json:"-" csv:"Phone"`
	DateOfBirth string    `json:"-" csv:"Date of birth"`
	JobTitle    string    `json:"job_title" csv:"Job Title"`
}

type Users struct {
	Users        []User `json:"users"`
	TotalRecords int    `json:"total_records"`
}

type UserRequestParams struct {
	Id     string `param:"id"` // email id of last record in page
	Search string `param:"search"`
}

func GetUserId(db *sql.DB, table string, params UserRequestParams) (User, error) {
	userWithId := User{
		Id: 0,
	}

	fmt.Printf("Id: %s, Search: %s\n", params.Id, params.Search)

	if params.Id == "" {
		return userWithId, nil
	}

	id, err := strconv.Atoi(params.Id)
	if err != nil {
		return userWithId, err
	}

	userWithId.Id = id

	// idQuery := fmt.Sprintf("SELECT id FROM %s WHERE email='%s' LIMIT 1", table, params.Id)
	// fmt.Println(idQuery)
	// row := db.QueryRow(idQuery)
	// err := row.Scan(&userWithId.Id)

	// fmt.Printf("Id on email: %d\n", userWithId.Id)
	// if err != nil {
	// 	return userWithId, err
	// }

	return userWithId, nil
}

func GetUsers(table string, params UserRequestParams) (Users, error) {
	db := db.GetDB()

	userWithId, err := GetUserId(db, table, params)
	if err != nil {
		return Users{}, err
	}

	result := Users{}

	sqlCountStatement := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE name LIKE '%s%s'", table, params.Search, "%")
	fmt.Println(sqlCountStatement)
	row := db.QueryRow(sqlCountStatement)
	countErr := row.Scan(&result.TotalRecords)

	if countErr != nil {
		return Users{}, err
	}

	sqlStatement := fmt.Sprintf("SELECT id, name, email, job_title FROM %s WHERE name LIKE '%s%s' AND id > %d ORDER BY id ASC LIMIT 50", table, params.Search, "%", userWithId.Id)
	fmt.Println(sqlStatement)
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return Users{}, err
	}
	defer rows.Close()

	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.Id, &user.Name, &user.Email, &user.JobTitle)

		if err != nil {
			return Users{}, err
		}

		result.Users = append(result.Users, user)
	}

	return result, nil
}

func GetParams(c echo.Context) (UserRequestParams, error) {
	params := UserRequestParams{}
	params.Id = c.QueryParam("id")
	params.Search = c.QueryParam("search")

	fmt.Println(params)
	return params, nil
}

func GetUsers1K(c echo.Context) (Users, error) {
	requestParams, err := GetParams(c)
	if err != nil {
		return Users{}, err
	}
	return GetUsers("user_1k_optimized", requestParams)
}

func GetUsers10K(c echo.Context) (Users, error) {
	requestParams, err := GetParams(c)
	if err != nil {
		return Users{}, err
	}
	return GetUsers("user_10k_optimized", requestParams)
}

func GetUsers2M(c echo.Context) (Users, error) {
	requestParams, err := GetParams(c)
	if err != nil {
		return Users{}, err
	}
	return GetUsers("user_2m_optimized", requestParams)
}

func GetUsers100K(c echo.Context) (Users, error) {
	requestParams, err := GetParams(c)
	if err != nil {
		return Users{}, err
	}
	return GetUsers("user_100k_optimized", requestParams)
}
