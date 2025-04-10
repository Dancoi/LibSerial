import React, { useState } from 'react';
import axios from 'axios';
import SeriesCard from "../components/serialCard/SerialCard.jsx";
import {useNavigate} from "react-router-dom";

const FindAddPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:8080/api/series/search?query=${query}`);
            setResults(response.data);
        } catch (err) {
            setError('Ошибка при поиске сериалов');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (series) => {
        setSelectedSeries(series);
        setShowModal(true);
    };

    const handleConfirmAdd = async () => {
        if (!selectedSeries) return;
        try {
            await axios.post("http://localhost:8080/api/series", selectedSeries);
            setShowModal(false);
            setSelectedSeries(null);
            navigate(`/serial/${selectedSeries.ID}`);
        } catch (error) {
            console.error("Ошибка при добавлении сериала:", error);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedSeries(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Поиск сериала</h1>
                    <h2 className="py-4 text-2xl text-gray-900">Введите название сериала, а затем выберите искомый</h2>
                </div>
                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Введите название сериала"
                        className="p-2 w-1/2 border border-gray-300 rounded-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="ml-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Искать
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && results.length > 0 && (
                    <div className="grid justify-center grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.map((series) => (
                            <div key={series.id} onClick={() => handleCardClick(series)} className="cursor-pointer">
                                <SeriesCard series={series} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && results.length === 0 && (
                    <div className="text-center text-gray-600">
                        <p>Ничего не найдено</p>
                    </div>
                )}
            </div>

            {showModal && selectedSeries && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Добавить сериал?</h2>
                        <p className="mb-6">{selectedSeries.Title}</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={handleCancel}
                            >
                                Нет
                            </button>

                            <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                onClick={handleConfirmAdd}
                            >
                                Да
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindAddPage;

