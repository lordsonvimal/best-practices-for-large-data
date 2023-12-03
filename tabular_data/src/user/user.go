package user

import (
	"fmt"
	"os"
	"time"

	"github.com/gocarina/gocsv"
	"github.com/lordsonvimal/best-practices-for-large-data/tabular_data/db"
)

type User struct {
	Id          int       `json:"id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	FirstName   string    `json:"first_name" csv:"First Name"` // .csv column headers
	LastName    string    `json:"last_name" csv:"Last Name"`
	Sex         string    `json:"gender" csv:"Sex"`
	Email       string    `json:"email" csv:"Email"`
	Phone       string    `json:"phone" csv:"Phone"`
	DateOfBirth string    `json:"dob" csv:"Date of birth"`
	JobTitle    string    `json:"job_title" csv:"Job Title"`
}

type Users struct {
	Users []User `json:"users"`
}

func CreateUsers(users []*User) ([]*User, error) {
	db := db.GetDB()
	sqlStatement := `INSERT INTO user_100k (first_name, last_name, sex, email, phone, date_of_birth, job_title, created_at, updated_at) VALUES `
	vals := []interface{}{}

	columns := 9
	for i, row := range users {
		sqlStatement += fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d),", i*columns+1, i*columns+2, i*columns+3, i*columns+4, i*columns+5, i*columns+6, i*columns+7, i*columns+8, i*columns+9)
		vals = append(vals, row.FirstName, row.LastName, row.Sex, row.Email, row.Phone, row.DateOfBirth, row.JobTitle, row.CreatedAt, row.UpdatedAt)
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

func CreateRecordsFromCSV(path string) {
	in, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer in.Close()

	users := []*User{}

	if err := gocsv.UnmarshalFile(in, &users); err != nil {
		panic(err)
	}

	for i := range users {
		r := users[i]
		r.CreatedAt = time.Now()
		r.UpdatedAt = time.Now()
	}

	fmt.Println(len(users))

	chunkSize := 1000
	totalRecords := len(users)
	totalChunks := (totalRecords + chunkSize - 1) / chunkSize

	if totalChunks == 0 || totalChunks == 1 {
		CreateUsers(users)
	}

	chunks := make([][]*User, totalChunks)
	for i := range chunks {
		start := i * chunkSize
		end := (i + 1) * chunkSize
		if end > totalRecords {
			end = totalRecords
		}
		chunks[i] = users[start:end]
		fmt.Printf("\nCreating Chunked users : %d", len(chunks[i]))
		CreateUsers(chunks[i])
	}
}

func Create2MUsers() {
	CreateRecordsFromCSV("../../assets/people-2000000.csv")
}

func Create1KUsers() {
	CreateRecordsFromCSV("../../assets/people-1000.csv")
}

func Create10KUsers() {
	CreateRecordsFromCSV("../../assets/people-10000.csv")
}

func Create100KUsers() {
	CreateRecordsFromCSV("../assets/people-100000.csv")
}

func GetUsers(table string) (Users, error) {
	sqlStatement := "SELECT * FROM " + table
	db := db.GetDB()
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return Users{}, err
	}
	defer rows.Close()
	result := Users{}

	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.Id, &user.FirstName, &user.LastName, &user.Sex, &user.Email, &user.Phone, &user.DateOfBirth, &user.JobTitle, &user.CreatedAt, &user.UpdatedAt)

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
