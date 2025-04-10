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

	Status    string    `gorm:"size:100"`       // например: "watching", "completed", "planned"
	Rating    int       `gorm:"default:0"`      // рейтинг от пользователя
	Note      string    `gorm:"size:512"`       // заметка
	CreatedAt time.Time `gorm:"autoCreateTime"` // когда добавил
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
