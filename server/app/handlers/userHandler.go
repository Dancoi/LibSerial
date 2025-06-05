package handlers

import (
	"encoding/json"
	"libserial/server/db"
	"libserial/server/db/models/userModel"
	"net/http"
	"time"
)

type ResponseUser struct {
	ID    uint
	Name  string
	Email string

	RoleID uint
	Role   userModel.Role

	CreatedAt time.Time
	UpdatedAt time.Time
}

func GetAllusers(w http.ResponseWriter, r *http.Request) {
	var listUsers []userModel.User

	err := db.DB.Preload("Role").Find(&listUsers).Error
	if err != nil {
		http.Error(w, "Ошибка получения пользователей", http.StatusInternalServerError)
		return
	}

	var responseUsers []ResponseUser
	for _, user := range listUsers {
		responseUsers = append(responseUsers, ResponseUser{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			RoleID:    user.RoleID,
			Role:      user.Role,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		})
	}

	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(responseUsers)
	if err != nil {
		http.Error(w, "Ошибка кодирования JSON", http.StatusInternalServerError)
		return
	}
}

func Getuserbyid(w http.ResponseWriter, r *http.Request) {
	var user userModel.User
	UserID := r.Context().Value("UserID").(uint)

	err := db.DB.Preload("Role").Where("id = ?", UserID).First(&user).Error
	if err != nil {
		http.Error(w, "Ошибка получения пользователя", http.StatusNotFound)
		return
	}

	responseUser := ResponseUser{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		RoleID:    user.RoleID,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(responseUser)
	if err != nil {
		http.Error(w, "Ошибка кодирования данных", http.StatusInternalServerError)
		return
	}
}

type UpdateUserNameRequest struct {
	Name string `json:"name"`
}

func UpdateUserName(w http.ResponseWriter, r *http.Request) {
	UserID, ok := r.Context().Value("UserID").(uint)
	if !ok {
		http.Error(w, "Ошибка авторизации", http.StatusUnauthorized)
		return
	}

	var req UpdateUserNameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Неверный формат данных", http.StatusBadRequest)
		return
	}

	if req.Name == "" {
		http.Error(w, "Имя не может быть пустым", http.StatusBadRequest)
		return
	}

	var user userModel.User
	if err := db.DB.First(&user, UserID).Error; err != nil {
		http.Error(w, "Пользователь не найден", http.StatusNotFound)
		return
	}

	user.Name = req.Name
	if err := db.DB.Save(&user).Error; err != nil {
		http.Error(w, "Ошибка обновления имени", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Имя успешно обновлено",
	})
}

type UpdateUserRoleRequest struct {
	UserID uint `json:"user_id"`
	RoleID uint `json:"role_id"`
}

func UpdateUserRole(w http.ResponseWriter, r *http.Request) {
	authRole, ok := r.Context().Value("UserRole").(string)
	if !ok || authRole != "admin" {
		http.Error(w, "Доступ запрещён", http.StatusForbidden)
		return
	}

	var req UpdateUserRoleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Неверный формат данных", http.StatusBadRequest)
		return
	}

	var user userModel.User
	if err := db.DB.First(&user, req.UserID).Error; err != nil {
		http.Error(w, "Пользователь не найден", http.StatusNotFound)
		return
	}

	user.RoleID = req.RoleID
	if err := db.DB.Save(&user).Error; err != nil {
		http.Error(w, "Ошибка обновления роли", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Роль пользователя успешно обновлена",
	})
}
