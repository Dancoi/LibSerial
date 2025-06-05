import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import axios from 'axios';
import SeriesCard from '../components/serialCard/SerialCard.jsx';

const SearchPage = () => {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [genres, setGenres] = useState([]);
    const [searchParams, setSearchParams] = useState({
        title: '',
        genre: '',
        yearFrom: '',
        yearTo: '',
        status: ''
    });

    useEffect(() => {
        const fetchGenresAndSeries = async () => {
            try {
                const genresResponse = await axios.get('http://localhost:8080/api/genres');
                setGenres(genresResponse.data);

                fetchSeries();
            } catch (err) {
                console.error("Ошибка при получении данных:", err);
                setError(err.response?.data);
                setLoading(false);
            }
        };

        fetchGenresAndSeries();
    }, []);

    const fetchSeries = async (paramsOverride = searchParams) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (paramsOverride.title) params.append('title', paramsOverride.title);
            if (paramsOverride.genre) params.append('genre', paramsOverride.genre);
            if (paramsOverride.yearFrom) params.append('yearFrom', paramsOverride.yearFrom);
            if (paramsOverride.yearTo) params.append('yearTo', paramsOverride.yearTo);
            // if (paramsOverride.status) params.append('status', paramsOverride.status);
            if (paramsOverride.status === 'ongoing') {
                params.append('status', '');
            } else if (paramsOverride.status) {
                params.append('status', paramsOverride.status);
            }

            const response = await axios.get(`http://localhost:8080/api/series?${params.toString()}`);
            setSeries(response.data);
        } catch (err) {
            console.error("Ошибка при получении данных:", err);
            setError(err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchSeries();
    };

    const handleResetFilters = () => {
        const defaultParams = {
            title: '',
            genre: '',
            yearFrom: '',
            yearTo: '',
            status: ''
        };

        setSearchParams(defaultParams);
        fetchSeries(defaultParams); // передай явно
    };


    return (
        <div className="mx-auto px-4 py-8 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-indigo-600 border-l-4 border-indigo-500 pl-4 mb-6">
                Расширенный поиск
            </h1>

            <form onSubmit={handleSearchSubmit} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Название сериала"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchParams.title}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <select
                        name="genre"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchParams.genre}
                        onChange={handleSearchChange}
                    >
                        <option value="">Все жанры</option>
                        {genres.map(genre => (
                            <option key={genre.ID} value={genre.ID}>{genre.Name}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="yearFrom"
                        placeholder="Год от"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchParams.yearFrom}
                        onChange={handleSearchChange}
                    />

                    <input
                        type="number"
                        name="yearTo"
                        placeholder="Год до"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchParams.yearTo}
                        onChange={handleSearchChange}
                    />

                    <select
                        name="status"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchParams.status}
                        onChange={handleSearchChange}
                    >
                        <option value="">Все статусы</option>
                        <option value="ongoing">Идёт</option>
                        <option value="completed">Завершён</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Найти
                    </button>
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Сбросить фильтры
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : series.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {series.map(show => (
                        <Link key={show.ID} to={`/serial/${show.ID}`}>
                            <SeriesCard series={show}/>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">Сериалов по вашему запросу не найдено.</p>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                             role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;