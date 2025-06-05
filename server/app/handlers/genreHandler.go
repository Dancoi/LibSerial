package handlers

import (
	"encoding/json"
	"libserial/server/db"
	"libserial/server/db/models/seriesModel"
	"log"
	"net/http"
)

func GetGenres(w http.ResponseWriter, r *http.Request) {
	var genres []seriesModel.Genre
	if err := db.DB.Find(&genres).Error; err != nil {
		log.Fatal(err)
	}
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(genres)
	if err != nil {
		http.Error(w, "Ошибка кодирования JSON", http.StatusInternalServerError)
		return
	}
}
