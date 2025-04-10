package db

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"libserial/server/db/models/seriesModel"
	"libserial/server/db/models/userModel"
	"libserial/server/db/models/userSeries"
	"log"
)

var DB *gorm.DB
var migrationBool bool

func ConnectDB(dsn string) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}

	migrationBool = true
	if migrationBool {
		err = db.AutoMigrate(
			&userModel.User{},
			&userModel.Role{},
			&userSeries.UserSeries{},

			&seriesModel.Genre{},
			&seriesModel.Series{},
			&seriesModel.Season{},
			&seriesModel.Episode{},
		)
	}

	if err != nil {
		log.Fatal("Ошибка миграции:", err)
	}

	DB = db
	fmt.Println("База данных подключена и таблицы созданы!")
}
