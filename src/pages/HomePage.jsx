import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import {Plus, Search} from 'lucide-react';
import SeriesCard from '../components/serialCard/SerialCard.jsx';
import axios from 'axios';
import Carousel from "../components/Carousel/Carousel.jsx";
// import { mockSeries } from '../../public/mockData.js';

const HomePage = () => {
    const [series, setSeries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const filteredSeries = series.filter(show =>
        show.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.Genres.some(g => g.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const carouselSeries = series.slice(0, 9).map(s => ({
        id: s.ID,
        title: s.Title,
        poster: s.PosterURL,
        rating: s.Rating,
    }));

    return (
        <div className="mx-auto px-4 py-8 rounded-xl shadow-md">

            <div className="mb-8 mx-auto">
                <h1 className="text-3xl font-bold text-indigo-600 border-l-4 border-indigo-500 pl-4 mb-4">
                    Каталог сериалов
                </h1>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            placeholder="Введите название или жанр"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Link to="/search">
                        <button
                            className="whitespace-nowrap px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Добавить сериал
                        </button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : filteredSeries.length > 0 ? (
                <>
                    {searchTerm === '' &&
                        <div className="my-8">
                            {/*<h2 className="text-2xl font-bold text-white mb-4 text-center">Избранные сериалы</h2>*/}
                            <Carousel seriesData={carouselSeries} Title={"Новинки"}/>
                        </div>
                    }

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredSeries.map(show => (
                            <Link key={show.ID} to={`/serial/${show.ID}`}>
                                <SeriesCard series={show}/>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">Сериалов по вашему запросу не найдено. Попробуйте ещё раз или
                        добавьте его сами!</p>
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

export default HomePage;