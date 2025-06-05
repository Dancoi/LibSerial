package kinopoiskParse

import (
	"encoding/json"
	"fmt"
	"io"
	"libserial/server/db/models/seriesModel"
	"net/http"
	"sort"
)

//type APISeason struct {
//	Number   int `json:"number"`
//	Episodes []struct {
//		Number      int    `json:"number"`
//		Name        string `json:"name"`
//		Description string `json:"description"`
//		Poster      struct {
//			URL string `json:"url"`
//		} `json:"still"`
//	} `json:"episodes"`
//}
//
//func fetchSeasonsForSeries(seriesID uint) ([]seriesModel.Season, error) {
//	apiURL := fmt.Sprintf("https://api.kinopoisk.dev/v1.4/season?movieId=%d", seriesID)
//
//	req, err := http.NewRequest("GET", apiURL, nil)
//	if err != nil {
//		return nil, err
//	}
//	req.Header.Add("X-API-KEY", apiKey)
//	req.Header.Add("Accept", "application/json")
//
//	resp, err := http.DefaultClient.Do(req)
//	if err != nil {
//		return nil, err
//	}
//	defer func(Body io.ReadCloser) {
//		err := Body.Close()
//		if err != nil {
//			return
//		}
//	}(resp.Body)
//
//	var apiSeasons []APISeason
//	if err := json.NewDecoder(resp.Body).Decode(&apiSeasons); err != nil {
//		return nil, err
//	}
//
//	var seasons []seriesModel.Season
//	for _, s := range apiSeasons {
//		var episodes []seriesModel.Episode
//		for _, ep := range s.Episodes {
//			episodes = append(episodes, seriesModel.Episode{
//				Number:      ep.Number,
//				Title:       ep.Name,
//				Description: ep.Description,
//				PosterURL:   ep.Poster.URL,
//			})
//		}
//		seasons = append(seasons, seriesModel.Season{
//			Number:   s.Number,
//			Episodes: episodes,
//		})
//	}
//
//	return seasons, nil
//}

type APIEpisode struct {
	Number      int    `json:"number"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Poster      struct {
		URL string `json:"url"`
	} `json:"still"`
}

type APISeason struct {
	Number   int          `json:"number"`
	Episodes []APIEpisode `json:"episodes"`
}

type SeasonResponse struct {
	Docs []APISeason `json:"docs"`
}

func FetchSeasonsForSeries(seriesID uint) ([]seriesModel.Season, error) {
	apiURL := fmt.Sprintf("https://api.kinopoisk.dev/v1.4/season?limit=20&sortField=number&sortType=1&movieId=%d", seriesID)

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("ошибка создания запроса: %w", err)
	}
	req.Header.Add("X-API-KEY", apiKey)
	req.Header.Add("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("ошибка при выполнении запроса: %w", err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
		}
	}(resp.Body)

	var result SeasonResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("ошибка декодирования JSON: %w", err)
	}

	sort.Slice(result.Docs, func(i, j int) bool {
		return result.Docs[i].Number < result.Docs[j].Number
	})

	var seasons []seriesModel.Season
	for _, s := range result.Docs {
		if s.Number == 0 {
			continue
		}
		var episodes []seriesModel.Episode
		for _, ep := range s.Episodes {
			episodes = append(episodes, seriesModel.Episode{
				Number:      ep.Number,
				Title:       ep.Name,
				Description: ep.Description,
				PosterURL:   ep.Poster.URL,
			})
		}

		sort.Slice(episodes, func(i, j int) bool {
			return episodes[i].Number < episodes[j].Number
		})

		//fmt.Printf("Season %d:\n", s.Number)
		//for _, ep := range s.Episodes {
		//	fmt.Printf("  Episode: %d - %s\n", ep.Number, ep.Name)
		//}

		seasons = append(seasons, seriesModel.Season{
			Number:   s.Number,
			Episodes: episodes,
		})
	}

	return seasons, nil
}
