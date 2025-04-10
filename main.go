package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"libserial/server/app/routes"
	"libserial/server/db"
	"libserial/server/utilites/kinopoiskParse"
	"log"
	"net/http"
	"os"
)

func Init() {
	fmt.Println("Initializing DataBase...")

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	x_api_key := os.Getenv("X_API_KEY")

	db.ConnectDB(dsn)
	kinopoiskParse.SetAPIKey(x_api_key)
	//kinopoiskParse.MapModelFromApiToDB("Пространство", 1, 1)
	//kinopoiskParse.MapModelFromApiToDB("Голяк", 1, 1)
	//kinopoiskParse.MapModelFromApiToDB("Бесстыжие", 1, 1)
	//kinopoiskParse.MapModelFromApiToDB("Сосны", 1, 1)
	//kinopoiskParse.MapModelFromApiToDB("Мир дикого запада", 1, 1)
}

func main() {
	Init()

	r := routes.Routes()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Фронтенд
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Println("Сервер запущен на http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
