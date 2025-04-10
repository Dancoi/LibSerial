package seriesModel

// Series - модель для хранения информации о сериалах
type Series struct {
	ID uint `gorm:"primaryKey"`

	Title            string  `gorm:"size:255;not null"`
	Year             int     `gorm:"not null"`
	Description      string  `gorm:"size:1048"`
	ShortDescription string  `gorm:"size:512"`
	AgeRating        int     `gorm:"size:128"`
	Status           string  `gorm:"size:128;not null"`
	LogoURL          string  `gorm:"size:512;default:'https://placehold.co/600x400'"`
	PosterURL        string  `gorm:"size:512;default:'https://placehold.co/600x400'"`
	BackdropURL      string  `gorm:"size:512;default:'https://placehold.co/600x400'"`
	Rating           float64 `gorm:"not null"`

	Genres  []Genre  `gorm:"many2many:series_genres;constraint:OnDelete:CASCADE;"`
	Seasons []Season `gorm:"foreignKey:SeriesID;constraint:OnDelete:CASCADE;"`
	//UserSeries []userSeries.UserSeries

	CreatedAt int64 `gorm:"autoCreateTime"`
	UpdatedAt int64 `gorm:"autoUpdateTime"`
}
