import React from "react";
import { ChevronDown, ChevronUp, Calendar, PlayCircle } from "lucide-react";

const SeasonsList = ({ seasons = [], openSeasons, toggleSeason, series }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Сезоны</h2>

            <div className="space-y-4">
                {seasons.map((season, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <button
                            onClick={() => toggleSeason(index)}
                            className="w-full flex justify-between items-center text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition"
                        >
                            <span>Сезон {season.Number}</span>
                            {openSeasons[index] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>

                        {openSeasons[index] && (
                            <div className="mt-4 space-y-3">
                                {season.Episodes.map((episode) => (
                                    <div
                                        key={episode.ID}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                                    >
                                        <div
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            {episode.PosterURL && (
                                                <img
                                                    src={episode.PosterURL || series.BackdropURL}
                                                    alt={episode.Title}
                                                    className="w-48 h-36 object-cover rounded-md sm:shrink-0 self-center sm:self-auto"
                                                />
                                            )}

                                            <div className="flex-1 sm:mx-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {episode.Number}. {episode.Title}
                                                </h3>
                                                <p className="text-gray-500 mt-1">{episode.Description}</p>
                                            </div>

                                            <button
                                                className="flex items-center text-indigo-600 hover:text-indigo-700 sm:mt-0 self-start sm:self-auto">
                                                <PlayCircle className="h-6 w-6"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeasonsList;