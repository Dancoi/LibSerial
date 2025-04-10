package handlers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"libserial/server/db"
	"libserial/server/db/models/seriesModel"
	"libserial/server/db/models/userSeries"
	"net/http"
	"strconv"
)

type AddFavoriteRequest struct {
	SeriesID uint `json:"series_id"`
}

func GetIsSeriesInFavorites(w http.ResponseWriter, r *http.Request) {
	//userID := r.Context().Value("userID").(uint)
	userID, ok := r.Context().Value("UserID").(uint)
	if !ok {
		http.Error(w, "Ошибка авторизации", http.StatusUnauthorized)
		return
	}
	//seriesIDParam := chi.URLParam(r, "seriesID")

	vars := mux.Vars(r)
	seriesIDParam := vars["id"]

	seriesID, _ := strconv.ParseUint(seriesIDParam, 10, 64)

	var userSeries userSeries.UserSeries
	err := db.DB.
		Where("user_id = ? AND series_id = ?", userID, seriesID).
		First(&userSeries).Error

	inFavorites := err == nil
	json.NewEncoder(w).Encode(map[string]bool{"inFavorites": inFavorites})
}

func PostSeriesToFavorites(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("UserID").(uint)
	if !ok {
		http.Error(w, "Ошибка авторизации", http.StatusUnauthorized)
		return
	}

	var req AddFavoriteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Невалидный JSON", http.StatusBadRequest)
		return
	}

	var series seriesModel.Series
	if err := db.DB.First(&series, req.SeriesID).Error; err != nil {
		http.Error(w, "Сериал не найден", http.StatusNotFound)
		return
	}

	var existing userSeries.UserSeries
	err := db.DB.
		Where("user_id = ? AND series_id = ?", userID, req.SeriesID).
		First(&existing).Error
	if err == nil {
		http.Error(w, "Сериал уже в избранном", http.StatusConflict)
		return
	}

	newEntry := userSeries.UserSeries{
		UserID:   userID,
		SeriesID: req.SeriesID,
		Status:   "favorite",
	}

	if err := db.DB.Create(&newEntry).Error; err != nil {
		http.Error(w, "Ошибка при добавлении", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Сериал добавлен в избранное"})
}

func DeleteFromFavorites(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("UserID").(uint)
	if !ok {
		http.Error(w, "Ошибка авторизации", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	seriesIDParam := vars["id"]

	seriesID, _ := strconv.ParseUint(seriesIDParam, 10, 64)

	if err := db.DB.
		Where("user_id = ? AND series_id = ?", userID, seriesID).
		Delete(&userSeries.UserSeries{}).Error; err != nil {
		http.Error(w, "Не удалось удалить из избранного", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func GetFavoriteSeries(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("UserID").(uint)
	if !ok {
		http.Error(w, "Ошибка авторизации", http.StatusUnauthorized)
		return
	}

	var favorites []userSeries.UserSeries
	err := db.DB.
		Where("user_id = ? AND status = ?", userID, "favorite").
		Find(&favorites).Error
	if err != nil {
		http.Error(w, "Ошибка при получении избранных сериалов", http.StatusInternalServerError)
		return
	}

	// Собираем список ID сериалов
	var seriesIDs []uint
	for _, fav := range favorites {
		seriesIDs = append(seriesIDs, fav.SeriesID)
	}

	// Получаем сами сериалы
	var seriesList []seriesModel.Series
	err = db.DB.Where("id IN ?", seriesIDs).Preload("Genres").Find(&seriesList).Error
	if err != nil {
		http.Error(w, "Ошибка при загрузке сериалов", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(seriesList)
}
