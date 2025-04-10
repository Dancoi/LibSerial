import React from "react";
import {
    Calendar, Eye, Film, Heart, Plus, Share2, Star,
} from "lucide-react";

const SeriesInfo = ({ series, isWatchlist, onWatchlistToggle }) => {
    return (
        <div className="relative w-full min-h-[60vh] overflow-hidden">
            {/* Фон через <img> */}
            <img
                src={series.BackdropURL !== "https://placehold.co/600x400" ? series.BackdropURL : series.PosterURL}
                alt="Backdrop"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />

            {/* Контент */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center h-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full">
                    {/* Постер */}
                    <div className="md:col-span-3 flex justify-center md:justify-start">

                        {series.PosterURL !== 'https://placehold.co/600x400' ? (
                            <img
                                src={series.PosterURL}
                                alt={series.Title}
                                className="rounded-lg shadow-xl w-48 sm:w-64 md:w-full"
                            />
                        ) : (
                            <img
                                src={series.LogoURL}
                                alt={series.Title}
                                className="rounded-lg shadow-xl w-48 sm:w-64 md:w-full"
                            />
                        )}

                    </div>

                    {/* Информация */}
                    <div className="md:col-span-9 text-white mt-6 md:mt-0">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{series.Title}</h1>

                        <div className="flex flex-wrap gap-4 mb-4 text-sm">
                            <div className="flex items-center">
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2"/>
                                {series.Rating !== 0 ? (
                                    <span>{series.Rating.toFixed(1)}/10</span>
                                ) : (
                                    <span>Не достаточно оценок для рейтинга</span>
                                )}
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2"/>
                                <span>{series.Year}</span>
                            </div>
                            <div className="flex items-center">
                                <Eye className="h-5 w-5 mr-2"/>
                                <span>{series.AgeRating}+</span>
                            </div>
                            <div className="flex items-center">
                                <Film className="h-5 w-5 mr-2"/>
                                <span>{series.Status === 'completed' ? 'Завершён' : 'Снимается'}</span>
                            </div>
                        </div>

                        <p className="text-base sm:text-lg text-gray-200 mb-4">{series.Description}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {series.Genres.map((genre, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-center px-3 py-1 bg-indigo-600/50 rounded-full text-sm text-white min-h-[32px] capitalize"
                                >
                                    <span className="">{genre.Name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 flex-wrap">
                            <button
                                onClick={onWatchlistToggle}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                                    isWatchlist ? 'bg-indigo-600/80 text-white hover:bg-indigo-600/50' : 'bg-white/80 text-indigo-600 hover:bg-white/50'
                                }`}
                            >
                                {isWatchlist ? (
                                    <>
                                        <Heart className="h-5 w-5 mr-2 fill-current"/>
                                        В избранном
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5 mr-2"/>
                                        В избранное
                                    </>
                                )}
                            </button>
                            <button
                                className="flex items-center px-4 py-2 bg-white/80 text-indigo-600 rounded-lg font-medium hover:bg-white/50 transition-colors"
                            >
                                <Share2 className="h-5 w-5 mr-2"/>
                                Поделиться
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeriesInfo;
