package seriesModel

type Episode struct {
	ID          uint `gorm:"primaryKey"`
	Number      int
	Title       string
	Description string
	PosterURL   string

	SeasonID uint
}
