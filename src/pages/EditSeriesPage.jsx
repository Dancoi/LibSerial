import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {Type} from "lucide-react";

const EditSeriesPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Title: '',
        Year: 0,
        Description: '',
        ShortDescription: '',
        AgeRating: 0,
        Status: '',
        LogoURL: '',
        PosterURL: '',
        BackdropURL: '',
        Rating: 0,
    });
    const [allGenres, setAllGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [seriesResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/series/${id}`)
                ]);

                setFormData({
                    ...seriesResponse.data,
                });
            } catch (err) {
                console.error("Ошибка при получении данных:", err);
                setError(err.response?.data || 'Произошла ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleGenreChange = (genreId) => {
    //     setFormData(prev => {
    //         if (prev.Genres.includes(genreId)) {
    //             return {
    //                 ...prev,
    //                 Genres: prev.Genres.filter(id => id !== genreId)
    //             };
    //         } else {
    //             return {
    //                 ...prev,
    //                 Genres: [...prev.Genres, genreId]
    //             };
    //         }
    //     });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const updatedFormData = {
                ...formData,
                Year: parseInt(formData.Year, 10),
                AgeRating: parseInt(formData.AgeRating, 10),
                Rating: parseFloat(formData.Rating),
            };
            await axios.put(`http://localhost:8080/api/series/${id}`, updatedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            Swal.fire(
                'Успех!',
                'Сериал успешно обновлен.',
                'success'
            ).then(() => {
                navigate('/admin/series');
            });
        } catch (err) {
            console.error("Ошибка при обновлении:", err);
            Swal.fire(
                'Ошибка!',
                'Не удалось обновить сериал.',
                'error'
            );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-indigo-600 border-l-4 border-indigo-500 pl-4 mb-4">
                    Редактирование сериала
                </h1>
                <Link
                    to="/admin/series"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    &larr; Назад к списку
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                        <input
                            type="text"
                            name="Title"
                            value={formData.Title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Год выпуска</label>
                        <input
                            type="number"
                            name="Year"
                            value={formData.Year}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Рейтинг</label>
                        <input
                            type="number"
                            step="0.1"
                            name="Rating"
                            value={formData.Rating}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Возрастной рейтинг</label>
                        <input
                            type="number"
                            name="AgeRating"
                            value={formData.AgeRating}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                        <select
                            name="Status"
                            value={formData.Status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Выберите статус</option>
                            <option value="Онгоинг">Онгоинг</option>
                            <option value="Завершен">Завершен</option>
                            <option value="Анонсирован">Анонсирован</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Короткое описание</label>
                        <textarea
                            name="ShortDescription"
                            value={formData.ShortDescription}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Полное описание</label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL постера</label>
                        <input
                            type="url"
                            name="PosterURL"
                            value={formData.PosterURL}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL логотипа</label>
                        <input
                            type="url"
                            name="LogoURL"
                            value={formData.LogoURL}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL фона</label>
                        <input
                            type="url"
                            name="BackdropURL"
                            value={formData.BackdropURL}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/*<div className="md:col-span-2">*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 mb-1">Жанры</label>*/}
                    {/*    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">*/}
                    {/*        {allGenres.map(genre => (*/}
                    {/*            <div key={genre.ID} className="flex items-center">*/}
                    {/*                <input*/}
                    {/*                    type="checkbox"*/}
                    {/*                    id={`genre-${genre.ID}`}*/}
                    {/*                    checked={formData.Genres.includes(genre.ID)}*/}
                    {/*                    onChange={() => handleGenreChange(genre.ID)}*/}
                    {/*                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"*/}
                    {/*                />*/}
                    {/*                <label htmlFor={`genre-${genre.ID}`} className="ml-2 text-sm text-gray-700">*/}
                    {/*                    {genre.Name}*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/series')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Сохранить изменения
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
        </div>
    );
};

export default EditSeriesPage;