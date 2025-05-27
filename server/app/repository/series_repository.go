package repository

import (
	"gorm.io/gorm"
	"libserial/server/db/models/seriesModel"
)

type SeriesRepository interface {
	GetAll() ([]seriesModel.Series, error)
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

func (r *seriesRepository) GetAll() ([]seriesModel.Series, error) {
	var series []seriesModel.Series
	err := r.db.
		Preload("Genres").
		Preload("Seasons").
		Preload("Seasons.Episodes").
		Find(&series).Error
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
