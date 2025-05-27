import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Search, Plus } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminSeriesPage = () => {
    const [series, setSeries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/series");
                setSeries(response.data);
            } catch (err) {
                console.error("Ошибка при получении данных:", err);
                setError(err.response?.data);
            } finally {
                setLoading(false);
            }
        };

        fetchSeries();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Вы уверены?',
            text: "Вы не сможете отменить это действие!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/series/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSeries(series.filter(item => item.ID !== id));
                Swal.fire(
                    'Удалено!',
                    'Сериал был успешно удален.',
                    'success'
                );
            } catch (err) {
                console.error("Ошибка при удалении:", err);
                Swal.fire(
                    'Ошибка!',
                    'Не удалось удалить сериал.',
                    'error'
                );
            }
        }
    };

    const filteredSeries = series.filter(show =>
        show.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (show.Genres && show.Genres.some(g => g.Name.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="mx-auto px-4 py-8 rounded-xl shadow-md">
            <div className="mb-8 mx-auto">
                <h1 className="text-3xl font-bold text-indigo-600 border-l-4 border-indigo-500 pl-4 mb-4">
                    Управление сериалами
                </h1>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            placeholder="Поиск по названию или жанру"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Link to="/search">
                        <button className="flex items-center whitespace-nowrap px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                            <Plus className="h-5 w-5 mr-2"/>
                            Добавить сериал
                        </button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left">Постер</th>
                            <th className="py-3 px-4 text-left">Название</th>
                            <th className="py-3 px-4 text-left">Год</th>
                            <th className="py-3 px-4 text-left">Рейтинг</th>
                            <th className="py-3 px-4 text-left">Жанры</th>
                            <th className="py-3 px-4 text-left">Статус</th>
                            <th className="py-3 px-4 text-right">Действия</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredSeries.length > 0 ? (
                            filteredSeries.map(show => (
                                <tr key={show.ID} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <img
                                            src={show.PosterURL || 'https://placehold.co/600x400'}
                                            alt={show.Title}
                                            className="h-16 w-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-4 font-medium">{show.Title}</td>
                                    <td className="py-3 px-4">{show.Year}</td>
                                    <td className="py-3 px-4">{show.Rating?.toFixed(1) || 'N/A'}</td>
                                    <td className="py-3 px-4">
                                        {show.Genres?.map(g => g.Name).join(', ') || '-'}
                                    </td>
                                    <td className="py-3 px-4">{show.Status === "completed" && "Завершён"}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                to={`/serial/${show.ID}`}
                                                className="p-2 text-blue-600 hover:text-blue-800"
                                                title="Просмотр"
                                            >
                                                <Eye className="h-5 w-5"/>
                                            </Link>
                                            <Link
                                                to={`/admin/series/edit/${show.ID}`}
                                                className="p-2 text-green-600 hover:text-green-800"
                                                title="Редактировать"
                                            >
                                                <Edit className="h-5 w-5"/>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(show.ID)}
                                                className="p-2 text-red-600 hover:text-red-800"
                                                title="Удалить"
                                            >
                                                <Trash2 className="h-5 w-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-6 text-center text-gray-500">
                                    {searchTerm ? 'Сериалов по вашему запросу не найдено' : 'Нет доступных сериалов'}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
        </div>
    );
};

export default AdminSeriesPage;