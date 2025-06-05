import React, { useEffect, useState } from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import SeriesInfo from '../components/seriesPage/SeriesInfo.jsx';
import SeasonsList from '../components/seriesPage/SeasonsList.jsx';
import {useAuth} from "../contexts/AuthContext.jsx";

const SeriesPage = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isWatchlist, setIsWatchlist] = useState(false);
    const [openSeasons, setOpenSeasons] = useState({});
    const navigate = useNavigate()

    const toggleSeason = (seasonId) => {
        setOpenSeasons(prev => {
            if (prev[seasonId]) {
                return { ...prev, [seasonId]: false };
            }
            const newState = {};
            newState[seasonId] = true;
            return newState;
        });
    };

    const fetchWatchlistStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/series/favorites/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsWatchlist(response.data.inFavorites);
        } catch (err) {
            console.error('Ошибка получения статуса избранного', err);
        }
    };

    const handleWatchlistToggle = async () => {
        if (!user) {
            navigate("/login")
            return
        }
        try {
            const token = localStorage.getItem('token');
            if (isWatchlist) {
                await axios.delete(`http://localhost:8080/api/series/favorites/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsWatchlist(false);
            } else {
                await axios.post('http://localhost:8080/api/series/favorites', {
                    series_id: series.ID
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsWatchlist(true);
            }
        } catch (err) {
            console.error('Ошибка при обновлении избранного', err);
        }
    };

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/series/${id}`);
                setSeries(response.data);
            } catch (err) {
                setError('Ошибка загрузки данных: ' + err);
            } finally {
                setLoading(false);
            }
        };
        fetchSeries();
        fetchWatchlistStatus();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !series) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {error || "Сериал не найден"}
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Сериал, который вы ищете, мог быть удален или временно недоступен.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Вернутся на главную страницу
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <SeriesInfo
                series={series}
                isWatchlist={isWatchlist}
                onWatchlistToggle={handleWatchlistToggle}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <SeasonsList
                    seasons={series.Seasons || []}
                    openSeasons={openSeasons}
                    toggleSeason={toggleSeason}
                    series={series}
                />
            </div>
        </div>
    );
};

export default SeriesPage;

