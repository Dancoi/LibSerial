import React, {useEffect, useState} from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Edit, Save, Clock, Star } from 'lucide-react';
// import { mockUserWatchlist } from '../../public/mockData.js';
import axios from "axios";
import {Link} from "react-router-dom";

const Profile = () => {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(user?.Name || '');
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/series/favorites/list', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setWatchlist(response.data);
            } catch (error) {
                console.error('Ошибка загрузки избранных сериалов', error);
            }
        };

        fetchFavorites();
    }, []);


    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/users/name', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: username }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка обновления профиля:', errorData);
                return;
            }

            const result = await response.json();
            console.log('Профиль обновлён:', result);
            setUser((prev) => ({
                ...prev,
                Name: username
            }));
            setEditing(false);
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    const removeFromWatchlist = async (seriesId) => {
        // setWatchlist(prev => prev.filter(series => series.id !== seriesId));
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:8080/api/series/favorites/${seriesId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                setWatchlist(prev => prev.filter(series => series.ID !== seriesId));
            } else {
                console.error('Не удалось удалить сериал из избранного');
            }
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="container max-w-4xl mx-auto my-5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="bg-indigo-600 h-32 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="bg-white p-2 rounded-full border-4 border-white shadow-lg">
                            <User className="h-24 w-24 text-indigo-600"/>
                        </div>
                    </div>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="absolute top-4 right-4 bg-white text-indigo-600 p-2 rounded-full hover:bg-indigo-50"
                        >
                            <Edit className="h-5 w-5"/>
                        </button>
                    )}
                    {editing && (
                        <button
                            onClick={handleSaveProfile}
                            className="absolute top-4 right-4 bg-white text-green-600 p-2 rounded-full hover:bg-green-50"
                        >
                            <Save className="h-5 w-5"/>
                        </button>
                    )}
                </div>
                <div className="pt-16 pb-8 px-8">
                    {editing ? (
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Имя
                                пользователя</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    ) : (
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.Name || "Dancoi"}</h2>
                    )}
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-700">
                            <span
                                className="font-medium">Тип аккаунта:</span> {user.Role.Role === 'user' ? 'Зритель' : 'Администратор'}
                        </p>
                        <p className="text-gray-700">
                            <span
                                className="font-medium">Зарегестрирован:</span> {new Date(user.CreatedAt).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Избранные сериалы</h3>

                    {watchlist.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">У вас нет избранных сериалов.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {watchlist.map(series => (
                                <div key={series.ID}
                                     className="flex items-center border-b border-gray-200 pb-4 last:border-0">
                                    <img
                                        src={series.PosterURL}
                                        alt={series.Title}
                                        className="w-16 h-24 object-cover rounded-md mr-4"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{series.Title}</h4>
                                        <div className="flex items-center text-sm text-gray-600 mb-1">
                                            <Clock className="h-4 w-4 mr-1"/>
                                            <span>{series.Year}</span>
                                            <span className="mx-2">•</span>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 mr-1 text-yellow-500"/>
                                                <span>{series.Rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {series.Genres.map((genre) => (
                                                <span
                                                    key={genre.ID}
                                                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                >
                                                    {genre.Name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <Link to={`/serial/${series.ID}`}>
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Перейти
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => removeFromWatchlist(series.ID)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        Удалить из избранного
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Profile;