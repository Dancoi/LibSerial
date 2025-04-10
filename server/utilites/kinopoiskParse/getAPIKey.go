package kinopoiskParse

import "log"

var apiKey string // замени на реальный ключ

// SetAPIKey устанавливает ключ API. Возвращает ошибку, если ключ пустой.
func SetAPIKey(key string) {
	if key == "" {
		log.Fatal("SetAPIKey вызвана с пустым API ключем!")
		return
	}
	apiKey = key
}
