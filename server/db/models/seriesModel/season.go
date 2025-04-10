package seriesModel

type Season struct {
	ID     uint `gorm:"primaryKey"`
	Number int

	SeriesID uint

	Episodes []Episode `gorm:"foreignKey:SeasonID;constraint:OnDelete:CASCADE;"`
}
