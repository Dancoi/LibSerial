package db

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"libserial/server/db/models/seriesModel"
	"libserial/server/db/models/userModel"
	"libserial/server/db/models/userSeries"
	"log"
	"os"
	"sync"
)

var (
	DB   *gorm.DB
	once sync.Once
)

func ConnectDB() *gorm.DB {
	once.Do(func() {
		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
			os.Getenv("DB_PORT"),
		)

		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatal("Ошибка подключения к БД:", err)
		}

		err = db.AutoMigrate(
			&userModel.User{},
			&userModel.Role{},
			&userSeries.UserSeries{},
			&seriesModel.Genre{},
			&seriesModel.Series{},
			&seriesModel.Season{},
			&seriesModel.Episode{},
		)
		if err != nil {
			log.Fatal("Ошибка миграции:", err)
		}

		var count int64
		db.Model(&userModel.Role{}).Where("id = ?", 1).Count(&count)
		if count == 0 {
			db.Create(&userModel.Role{ID: 1, Role: "user"})
		}
		db.Model(&userModel.Role{}).Where("id = ?", 2).Count(&count)
		if count == 0 {
			db.Create(&userModel.Role{ID: 1, Role: "admin"})
		}

		DB = db
		fmt.Println("База данных подключена и таблицы созданы!")
	})

	return DB
}
