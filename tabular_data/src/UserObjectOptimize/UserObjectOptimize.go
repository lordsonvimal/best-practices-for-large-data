package UserObjectOptimize

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gocarina/gocsv"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/db"
)

type UserCSV struct {
	FirstName   string `csv:"First Name"` // .csv column headers
	LastName    string `csv:"Last Name"`
	Sex         string `csv:"Sex"`
	Email       string `csv:"Email"`
	Phone       string `csv:"Phone"`
	DateOfBirth string `csv:"Date of birth"`
	JobTitle    string `csv:"Job Title"`
}

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
	Users []User `json:"users"`
}

func CreateUsers(users []*User, table string) ([]*User, error) {
	db := db.GetDB()
	sqlStatement := fmt.Sprintf("INSERT INTO %s (name, sex, email, phone, date_of_birth, job_title, created_at, updated_at) VALUES ", table)
	vals := []interface{}{}

	columns := 8
	for i, row := range users {
		sqlStatement += fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d),", i*columns+1, i*columns+2, i*columns+3, i*columns+4, i*columns+5, i*columns+6, i*columns+7, i*columns+8)
		vals = append(vals, row.Name, row.Sex, row.Email, row.Phone, row.DateOfBirth, row.JobTitle, row.CreatedAt, row.UpdatedAt)
	}
	// trim the last ,
	sqlStatement = sqlStatement[0 : len(sqlStatement)-1]

	// prepare the statement
	stmt, prepErr := db.Prepare(sqlStatement)

	if prepErr != nil {
		fmt.Println(prepErr)
		return users, prepErr
	}

	defer stmt.Close()

	// format all vals at once
	result, err := stmt.Exec(vals...)
	if err != nil {
		fmt.Println(err)
		return users, err
	}

	rowsAffected, err := result.RowsAffected()

	if err == nil {
		fmt.Printf("\nrows affected: %d", rowsAffected)
	}

	return users, nil
}

func CreateRecordsFromCSV(path string, table string) {
	in, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer in.Close()

	userCSVs := []*UserCSV{}
	users := []*User{}

	if err := gocsv.UnmarshalFile(in, &userCSVs); err != nil {
		panic(err)
	}

	for i := range userCSVs {
		csv := userCSVs[i]
		fmt.Printf("Email: %s\n", csv.Email)
		users = append(users, &User{
			Name:        fmt.Sprintf("%s %s", strings.ToLower(csv.FirstName), strings.ToLower(csv.LastName)),
			Sex:         csv.Sex,
			Email:       csv.Email,
			DateOfBirth: csv.DateOfBirth,
			Phone:       csv.Phone,
			JobTitle:    csv.JobTitle,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		})
	}

	// fmt.Println(len(users))

	chunkSize := 1000
	totalRecords := len(users)
	totalChunks := (totalRecords + chunkSize - 1) / chunkSize

	chunks := make([][]*User, totalChunks)
	for i := range chunks {
		start := i * chunkSize
		end := (i + 1) * chunkSize
		if end > totalRecords {
			end = totalRecords
		}
		chunks[i] = users[start:end]
		fmt.Printf("\nCreating Chunked users : %d", len(chunks[i]))
		CreateUsers(chunks[i], table)
	}
}

func Create2MUsers() {
	CreateRecordsFromCSV("../assets/people-2000000.csv", "user_2m_optimized")
}

func Create1KUsers() {
	CreateRecordsFromCSV("../assets/people-1000.csv", "user_1k_optimized")
}

func Create10KUsers() {
	CreateRecordsFromCSV("../assets/people-10000.csv", "user_10k_optimized")
}

func Create100KUsers() {
	CreateRecordsFromCSV("../assets/people-100000.csv", "user_100k_optimized")
}

func GetUsers(table string) (Users, error) {
	sqlStatement := "SELECT id, name, email, job_title FROM " + table
	db := db.GetDB()
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return Users{}, err
	}
	defer rows.Close()
	result := Users{}

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
