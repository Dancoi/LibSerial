package userModel

import (
	"time"

	"gorm.io/gorm"
)

// User - модель пользователя
type User struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:255;not null"`
	Email    string `gorm:"size:255;uniqueIndex;not null"`
	Password string `gorm:"not null"`

	RoleID uint `gorm:"not null;index;default:1"`
	Role   Role `gorm:"foreignKey:RoleID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	//UserSeries []userSeries.UserSeries

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
