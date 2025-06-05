package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io"
	"libserial/server/app/repository"
	"libserial/server/db/models/seriesModel"
	"libserial/server/utilites/kinopoiskParse"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

type SeriesHandler struct {
	repo repository.SeriesRepository
}

func NewSeriesHandler(repo repository.SeriesRepository) *SeriesHandler {
	return &SeriesHandler{repo: repo}
}

type SeriesHandlerBuilder struct {
	repo    repository.SeriesRepository
	builder kinopoiskParse.SeriesBuilder
}

func NewSerialHandleBuilder(repo repository.SeriesRepository, builder kinopoiskParse.SeriesBuilder) *SeriesHandlerBuilder {
	return &SeriesHandlerBuilder{repo: repo, builder: builder}
}

func (h *SeriesHandler) GetListSeries(w http.ResponseWriter, r *http.Request) {
	filters := map[string]string{
		"title":    r.URL.Query().Get("title"),
		"genre":    r.URL.Query().Get("genre"),
		"yearFrom": r.URL.Query().Get("yearFrom"),
		"yearTo":   r.URL.Query().Get("yearTo"),
		"status":   r.URL.Query().Get("status"),
	}

	series, err := h.repo.GetAll(filters)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, http.StatusOK, series)
}

func (h *SeriesHandler) GetSeriesByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	series, err := h.repo.GetByID(uint(id))
	if err != nil {
		http.Error(w, "Сериал не найден", http.StatusNotFound)
		return
	}

	respondWithJSON(w, http.StatusOK, series)
}

func (h *SeriesHandler) AddSeries(w http.ResponseWriter, r *http.Request) {
	var series seriesModel.Series
	if err := json.NewDecoder(r.Body).Decode(&series); err != nil {
		http.Error(w, "Неверный формат тела запроса", http.StatusBadRequest)
		return
	}

	seasons, err := kinopoiskParse.FetchSeasonsForSeries(series.ID)
	if err != nil {
		log.Printf("Не удалось получить сезоны для %s: %v\n", series.Title, err)
	}
	series.Seasons = seasons

	if err := h.repo.Create(&series); err != nil {
		http.Error(w, "Ошибка при сохранении сериала: "+err.Error(), http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, http.StatusCreated, series)
}

func (h *SeriesHandler) UpdateSeries(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	var series seriesModel.Series
	if err := json.NewDecoder(r.Body).Decode(&series); err != nil {
		http.Error(w, "Неверный формат тела запроса", http.StatusBadRequest)
		return
	}

	series.ID = uint(id)
	if err := h.repo.Update(&series); err != nil {
		http.Error(w, "Ошибка при обновлении сериала: "+err.Error(), http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, http.StatusOK, series)
}

func (h *SeriesHandler) DeleteSeries(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	if err := h.repo.Delete(uint(id)); err != nil {
		http.Error(w, "Ошибка при удалении сериала: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *SeriesHandlerBuilder) SearchSeriesHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")
	if query == "" {
		http.Error(w, "Параметр 'query' обязателен", http.StatusBadRequest)
		return
	}

	page, limit := getPaginationParams(r)

	apiURL := "https://api.kinopoisk.dev/v1.4/movie/search"
	params := url.Values{}
	params.Add("query", query)
	params.Add("page", fmt.Sprintf("%d", page))
	params.Add("limit", fmt.Sprintf("%d", limit))

	req, err := http.NewRequest("GET", apiURL+"?"+params.Encode(), nil)
	if err != nil {
		http.Error(w, "Ошибка создания запроса: "+err.Error(), http.StatusInternalServerError)
		return
	}

	req.Header.Add("X-API-KEY", os.Getenv("X_API_KEY"))
	req.Header.Add("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Ошибка выполнения запроса: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Ошибка чтения ответа: "+err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(string(body))

	var result struct {
		Docs []kinopoiskParse.APISeries `json:"docs"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		http.Error(w, "Ошибка разбора JSON: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var seriesList []seriesModel.Series
	for _, apiSeries := range result.Docs {
		if !apiSeries.IsSeries {
			continue
		}

		series, err := h.builder.
			WithID(apiSeries.ID).
			WithTitle(apiSeries.Name, apiSeries.AlternativeName).
			WithYear(apiSeries.Year).
			WithGenres([]struct{ Name string }(apiSeries.Genres)).
			WithSeasons(apiSeries.ID).
			WithRating(apiSeries.Rating.KP).
			WithImages(apiSeries.Poster.Url, apiSeries.Backdrop.Url, apiSeries.Logo.Url).
			WithDescription(apiSeries.Description, apiSeries.ShortDescription).
			WithAgeRating(apiSeries.AgeRating).
			WithStatus(apiSeries.Status).
			Build()

		if err != nil {
			log.Printf("Ошибка сборки сериала %s: %v\n", apiSeries.Name, err)
			continue
		}

		seriesList = append(seriesList, series)
	}

	respondWithJSON(w, http.StatusOK, seriesList)
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}

func getPaginationParams(r *http.Request) (int, int) {
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	limit := 30

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}

	return page, limit
}
