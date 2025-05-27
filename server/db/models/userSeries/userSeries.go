package userSeries

import (
	"libserial/server/db/models/seriesModel"
	"libserial/server/db/models/userModel"
	"time"
)

type UserSeries struct {
	UserID   uint               `gorm:"primaryKey"`
	SeriesID uint               `gorm:"primaryKey"`
	User     userModel.User     `gorm:"foreignKey:UserID"`
	Series   seriesModel.Series `gorm:"foreignKey:SeriesID"`

	Status    string    `gorm:"size:100"`
	Rating    int       `gorm:"default:0"`
	Note      string    `gorm:"size:512"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
