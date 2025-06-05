package routes

import (
	"fmt"
	"github.com/gorilla/mux"
	"libserial/server/app/handlers"
	"libserial/server/app/repository"
	"libserial/server/db"
	"libserial/server/utilites/kinopoiskParse"
	"net/http"
)

func Routes() *mux.Router {
	r := mux.NewRouter()

	base := "/api"

	r.HandleFunc(base+"/register", handlers.Register).Methods("POST")
	r.HandleFunc(base+"/login", handlers.Login).Methods("POST")
	r.HandleFunc(base+"/logout", handlers.Logout).Methods("DELETE")

	r.HandleFunc(base+"/users", handlers.Authenticate(handlers.GetAllusers)).Methods("GET")
	r.HandleFunc(base+"/users/me", handlers.Authenticate(handlers.Getuserbyid)).Methods("GET")
	r.HandleFunc(base+"/users/name", handlers.Authenticate(handlers.UpdateUserName)).Methods("PUT")
	r.HandleFunc(base+"/users/update-role", handlers.Authenticate(handlers.UpdateUserRole)).Methods("POST")

	//r.HandleFunc(base+"/series", handlers.GetListSeries).Methods("GET")
	//r.HandleFunc(base+"/series", handlers.AddSeries).Methods("POST")
	//r.HandleFunc(base+"/series/search", handlers.SearchSeriesHandler).Methods("GET")
	//r.HandleFunc(base+"/series/{id}", handlers.GetSeriesByID).Methods("GET")

	seriesRepo := repository.NewSeriesRepository(db.DB)
	seriesHandler := handlers.NewSeriesHandler(seriesRepo)
	seriesBuilder := kinopoiskParse.NewKinopoiskSeriesBuilder(db.DB)
	seriesHandlerBuilder := handlers.NewSerialHandleBuilder(seriesRepo, seriesBuilder)

	r.HandleFunc(base+"/series", seriesHandler.GetListSeries).Methods("GET")
	r.HandleFunc(base+"/series/search", seriesHandlerBuilder.SearchSeriesHandler).Methods("GET")
	//r.HandleFunc(base+"/series/search", seriesHandler.SearchSeriesHandler).Methods("GET")
	r.HandleFunc(base+"/series/{id:[0-9]+}", seriesHandler.GetSeriesByID).Methods("GET")
	r.HandleFunc(base+"/series", handlers.Authenticate(seriesHandler.AddSeries)).Methods("POST")
	r.HandleFunc(base+"/series/{id}", handlers.Authenticate(seriesHandler.UpdateSeries)).Methods("PUT")
	r.HandleFunc(base+"/series/{id:[0-9]+}", handlers.Authenticate(seriesHandler.DeleteSeries)).Methods("DELETE")

	r.HandleFunc(base+"/series/favorites", handlers.Authenticate(handlers.PostSeriesToFavorites)).Methods("POST")
	r.HandleFunc(base+"/series/favorites/{id:[0-9]+}", handlers.Authenticate(handlers.GetIsSeriesInFavorites)).Methods("GET")
	r.HandleFunc(base+"/series/favorites/list", handlers.Authenticate(handlers.GetFavoriteSeries)).Methods("GET")
	r.HandleFunc(base+"/series/favorites/{id:[0-9]+}", handlers.Authenticate(handlers.DeleteFromFavorites)).Methods("DELETE")

	r.HandleFunc(base+"/genres", handlers.GetGenres).Methods("GET")

	r.Handle(base+"/protected", handlers.Authenticate(func(w http.ResponseWriter, r *http.Request) {
		_, err := w.Write([]byte(fmt.Sprintf("Это защищённый маршрут UserID: %v", r.Context().Value("UserID"))))
		if err != nil {
			return
		}
	})).Methods("GET")

	return r
}
