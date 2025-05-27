package handlers

//
//import (
//	"encoding/json"
//	"github.com/gorilla/mux"
//	"gorm.io/gorm"
//	"libserial/server/db"
//	"libserial/server/db/models/seriesModel"
//	"libserial/server/utilites/kinopoiskParse"
//	"log"
//	"net/http"
//	"strconv"
//)
//
//func GetListSeries(w http.ResponseWriter, r *http.Request) {
//	var Series []seriesModel.Series
//
//	err := db.DB.
//		Preload("Genres").
//		Preload("Seasons").
//		Preload("Seasons.Episodes").
//		Find(&Series).Error
//	if err != nil {
//		http.Error(w, err.Error(), http.StatusInternalServerError)
//		return
//	}
//
//	w.WriteHeader(http.StatusOK)
//	err = json.NewEncoder(w).Encode(Series)
//	if err != nil {
//		http.Error(w, "Ошибка кодирования JSON", http.StatusInternalServerError)
//		return
//	}
//}
//
//func GetSeriesByID(w http.ResponseWriter, r *http.Request) {
//	var series seriesModel.Series
//
//	vars := mux.Vars(r)
//	id := vars["id"]
//
//	// Выполняем поиск по ID
//	err := db.DB.
//		Preload("Genres").
//		Preload("Seasons").
//		Preload("Seasons.Episodes", func(db *gorm.DB) *gorm.DB {
//			return db.Order("Number ASC")
//		}).
//		First(&series, "id = ?", id).Error
//	if err != nil {
//		http.Error(w, "Сериал не найден", http.StatusNotFound)
//		return
//	}
//
//	w.Header().Set("Content-Type", "application/json")
//	w.WriteHeader(http.StatusOK)
//	err = json.NewEncoder(w).Encode(series)
//	if err != nil {
//		http.Error(w, "Ошибка кодирования JSON", http.StatusInternalServerError)
//	}
//}
//
//func SearchSeriesHandler(w http.ResponseWriter, r *http.Request) {
//	query := r.URL.Query().Get("query")
//	if query == "" {
//		http.Error(w, "Параметр 'query' обязателен", http.StatusBadRequest)
//		return
//	}
//
//	pageStr := r.URL.Query().Get("page")
//	limitStr := r.URL.Query().Get("limit")
//
//	page := 1
//	limit := 5
//
//	if pageStr != "" {
//		if p, err := strconv.Atoi(pageStr); err == nil {
//			page = p
//		}
//	}
//	if limitStr != "" {
//		if l, err := strconv.Atoi(limitStr); err == nil {
//			limit = l
//		}
//	}
//
//	seriesList, err := kinopoiskParse.FetchSeriesForFrontend(query, page, limit)
//	if err != nil {
//		http.Error(w, "Ошибка получения сериалов: "+err.Error(), http.StatusInternalServerError)
//		return
//	}
//
//	w.Header().Set("Content-Type", "application/json")
//	if err := json.NewEncoder(w).Encode(seriesList); err != nil {
//		http.Error(w, "Ошибка кодирования JSON: "+err.Error(), http.StatusInternalServerError)
//	}
//}
//
//func AddSeries(w http.ResponseWriter, r *http.Request) {
//	var series seriesModel.Series
//	if err := json.NewDecoder(r.Body).Decode(&series); err != nil {
//		http.Error(w, "Неверный формат тела запроса", http.StatusBadRequest)
//		return
//	}
//
//	seasons, err := kinopoiskParse.FetchSeasonsForSeries(series.ID)
//	if err != nil {
//		log.Printf("Не удалось получить сезоны для %s: %v\n", series.Title, err)
//	}
//
//	series.Seasons = seasons
//
//	if err := db.DB.Create(&series).Error; err != nil {
//		http.Error(w, "Ошибка при сохранении сериала: "+err.Error(), http.StatusInternalServerError)
//		return
//	}
//
//	w.WriteHeader(http.StatusCreated)
//	json.NewEncoder(w).Encode(series)
//}
