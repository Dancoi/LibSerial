package userModel

// Role - хранит роли пользователей
type Role struct {
	ID    uint   `gorm:"primary_key;auto_increment"`
	Role  string `gorm:"size:255;"`
	Users []User `gorm:"foreignKey:RoleID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
