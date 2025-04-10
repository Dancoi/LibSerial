package seriesModel

// Genre - модель для хранения жанров
type Genre struct {
	ID     uint     `gorm:"primaryKey"`
	Name   string   `gorm:"size:100;unique;not null"`
	series []Series `gorm:"many2many:series_genres;"`
}
