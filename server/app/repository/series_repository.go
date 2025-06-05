package repository

import (
	"gorm.io/gorm"
	"libserial/server/db/models/seriesModel"
)

type SeriesRepository interface {
	//GetAll() ([]seriesModel.Series, error)
	GetAll(filters map[string]string) ([]seriesModel.Series, error)
	GetByID(id uint) (*seriesModel.Series, error)
	Create(series *seriesModel.Series) error
	Update(series *seriesModel.Series) error
	Delete(id uint) error
}

type seriesRepository struct {
	db *gorm.DB
}

func NewSeriesRepository(db *gorm.DB) SeriesRepository {
	return &seriesRepository{db: db}
}

//func (r *seriesRepository) GetAll() ([]seriesModel.Series, error) {
//	var series []seriesModel.Series
//	err := r.db.
//		Preload("Genres").
//		Preload("Seasons").
//		Preload("Seasons.Episodes").
//		Find(&series).Error
//	return series, err
//}

func (r *seriesRepository) GetAll(filters map[string]string) ([]seriesModel.Series, error) {
	var series []seriesModel.Series
	query := r.db.
		Preload("Genres").
		Preload("Seasons").
		Preload("Seasons.Episodes")

	// Фильтрация по названию (поиск по подстроке)
	if title, ok := filters["title"]; ok && title != "" {
		query = query.Where("title ILIKE ?", "%"+title+"%")
	}

	// Фильтрация по жанру (по ID)
	if genreID, ok := filters["genre"]; ok && genreID != "" {
		query = query.Joins("JOIN series_genres sg ON sg.series_id = series.id").
			Where("sg.genre_id = ?", genreID)
	}

	// Год выпуска от
	if yearFrom, ok := filters["yearFrom"]; ok && yearFrom != "" {
		query = query.Where("year >= ?", yearFrom)
	}

	// Год выпуска до
	if yearTo, ok := filters["yearTo"]; ok && yearTo != "" {
		query = query.Where("year <= ?", yearTo)
	}

	// Статус (например: ongoing, completed, announced)
	if status, ok := filters["status"]; ok && status != "" {
		query = query.Where("status = ?", status)
	}

	err := query.Find(&series).Error
	return series, err
}

func (r *seriesRepository) GetByID(id uint) (*seriesModel.Series, error) {
	var series seriesModel.Series
	err := r.db.
		Preload("Genres").
		Preload("Seasons").
		Preload("Seasons.Episodes").
		First(&series, id).Error
	return &series, err
}

func (r *seriesRepository) Create(series *seriesModel.Series) error {
	return r.db.Create(series).Error
}

func (r *seriesRepository) Update(series *seriesModel.Series) error {
	return r.db.Save(series).Error
}

func (r *seriesRepository) Delete(id uint) error {
	return r.db.Delete(&seriesModel.Series{}, id).Error
}
