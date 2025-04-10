package kinopoiskParse

import (
	"encoding/json"
	"fmt"
	"io"
	"libserial/server/db"
	"libserial/server/db/models/seriesModel"
	"log"
	"net/http"
	"net/url"
	"strings"
)

type APIResponse struct {
	Docs []APISeries `json:"docs"`
}

type APISeries struct {
	ID               uint   `json:"id"`
	Name             string `json:"name"`
	AlternativeName  string `json:"alternativeName"`
	Year             int    `json:"year"`
	Description      string `json:"description"`
	ShortDescription string `json:"shortDescription"`
	IsSeries         bool   `json:"isSeries"`
	AgeRating        int    `json:"ageRating"`
	Status           string `json:"status"`
	Poster           struct {
		Url string `json:"url"`
	} `json:"poster"`
	Backdrop struct {
		Url string `json:"url"`
	} `json:"backdrop"`
	Logo struct {
		Url string `json:"url"`
	} `json:"logo"`
	Rating struct {
		KP float64 `json:"kp"`
	} `json:"rating"`
	Genres []struct {
		Name string `json:"name"`
	} `json:"genres"`
}

func firstNonEmpty(values ...string) string {
	for _, val := range values {
		if strings.TrimSpace(val) != "" {
			return val
		}
	}
	return "Без названия"
}

func SaveSeriesToDB(apiSeries APISeries) error {
	var genres []seriesModel.Genre
	for _, g := range apiSeries.Genres {
		var genre seriesModel.Genre
		if err := db.DB.Where("name = ?", g.Name).FirstOrCreate(&genre, seriesModel.Genre{Name: g.Name}).Error; err != nil {
			return err
		}
		genres = append(genres, genre)
	}

	seasons, err := FetchSeasonsForSeries(apiSeries.ID)
	if err != nil {
		log.Printf("Не удалось получить сезоны для %s: %v\n", apiSeries.Name, err)
	}

	s := seriesModel.Series{
		ID:               apiSeries.ID,
		Title:            firstNonEmpty(apiSeries.Name, apiSeries.AlternativeName),
		Year:             apiSeries.Year,
		Description:      apiSeries.Description,
		ShortDescription: apiSeries.ShortDescription,
		AgeRating:        apiSeries.AgeRating,
		Status:           apiSeries.Status,
		LogoURL:          apiSeries.Logo.Url,
		PosterURL:        apiSeries.Poster.Url,
		BackdropURL:      apiSeries.Backdrop.Url,
		Rating:           apiSeries.Rating.KP,
		Genres:           genres,
		Seasons:          seasons,
	}

	return db.DB.Create(&s).Error
}

func MapModelFromApiToDB(query string, page int, limit int) {
	apiURL := "https://api.kinopoisk.dev/v1.4/movie/search"

	params := url.Values{}
	params.Add("query", query)
	params.Add("page", fmt.Sprintf("%d", page))
	params.Add("limit", fmt.Sprintf("%d", limit))

	req, err := http.NewRequest("GET", apiURL+"?"+params.Encode(), nil)
	if err != nil {
		log.Fatal("Ошибка создания запроса:", err)
	}

	req.Header.Add("X-API-KEY", apiKey)
	req.Header.Add("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Ошибка выполнения запроса:", err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
		}
	}(resp.Body)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal("Ошибка чтения ответа:", err)
	}

	var result APIResponse
	if err := json.Unmarshal(body, &result); err != nil {
		log.Fatal("Ошибка разбора JSON:", err)
	}

	for _, movie := range result.Docs {
		if err := SaveSeriesToDB(movie); err != nil {
			log.Println("Ошибка сохранения:", err)
		} else {
			log.Printf("Сериал '%s' сохранен!\n", movie.Name)
		}
	}
}

func FetchSeriesForFrontend(query string, page, limit int) ([]seriesModel.Series, error) {
	apiURL := "https://api.kinopoisk.dev/v1.4/movie/search"

	params := url.Values{}
	params.Add("query", query)
	params.Add("page", fmt.Sprintf("%d", page))
	params.Add("limit", fmt.Sprintf("%d", limit))

	req, err := http.NewRequest("GET", apiURL+"?"+params.Encode(), nil)
	if err != nil {
		return nil, fmt.Errorf("ошибка создания запроса: %w", err)
	}

	req.Header.Add("X-API-KEY", apiKey)
	req.Header.Add("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("ошибка выполнения запроса: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения ответа: %w", err)
	}

	var result APIResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("ошибка разбора JSON: %w", err)
	}

	var seriesList []seriesModel.Series
	for _, movie := range result.Docs {

		if !movie.IsSeries {
			continue
		}

		//var genres []seriesModel.Genre
		//for _, g := range movie.Genres {
		//	genres = append(genres, seriesModel.Genre{Name: g.Name})
		//}
		var genres []seriesModel.Genre
		for _, g := range movie.Genres {
			var genre seriesModel.Genre
			if err := db.DB.Where("name = ?", g.Name).FirstOrCreate(&genre, seriesModel.Genre{Name: g.Name}).Error; err != nil {
				return nil, err
			}
			genres = append(genres, genre)
		}

		series := seriesModel.Series{
			ID:               movie.ID,
			Title:            firstNonEmpty(movie.Name, movie.AlternativeName),
			Year:             movie.Year,
			Description:      movie.Description,
			ShortDescription: movie.ShortDescription,
			AgeRating:        movie.AgeRating,
			Status:           movie.Status,
			LogoURL:          movie.Logo.Url,
			PosterURL:        movie.Poster.Url,
			BackdropURL:      movie.Backdrop.Url,
			Rating:           movie.Rating.KP,
			Genres:           genres,
		}

		seriesList = append(seriesList, series)
	}

	return seriesList, nil
}
