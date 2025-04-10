import React, {useState} from 'react';
import { Star, Clock } from 'lucide-react';

const pluralizeSeason = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return 'сезон';
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'сезона';
    return 'сезонов';
};

const SeriesCard = ({ series }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-visible hover:shadow-lg transition-shadow duration-300">

            <div className="relative h-48 overflow-hidden">

                {series.BackdropURL !== 'https://placehold.co/600x400' && series.BackdropURL !== '' ? (
                    <img
                        src={series.BackdropURL}
                        alt={series.Title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    // <img
                    //     src={series.LogoURL}
                    //     alt={series.Title}
                    //     className="bg-gray-300 w-full h-full object-contain px-2"
                    // />
                    <img
                        src={
                            series.LogoURL !== 'https://placehold.co/600x400' && series.LogoURL !== ''
                                ? series.LogoURL
                                : series.PosterURL
                        }
                        alt={series.Title}
                        className="bg-gray-300 w-full h-full object-contain px-2"
                    />
                )}

                {series.Rating !== 0 &&
                    <div
                        className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 m-2 rounded-md flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current"/>
                        <span>{series.Rating.toFixed(1)}</span>
                    </div>
                }

            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-800">{series.Title}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-1"/>
                    <span>{series.Year}</span>

                    {series.Seasons !== null ? (
                        <>
                            <span className="mx-2">•</span>
                            <span>
                                {series.Seasons.length} {pluralizeSeason(series.Seasons?.length)}
                            </span>
                        </>
                    ) : <></>}

                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                    {series.Genres.slice(0, 2).map((genre) => (
                        <span
                            key={genre.ID}
                            className="px-2 py-1 bg-indigo-600/80 text-white text-xs rounded-full capitalize whitespace-nowrap"
                        >
                          {genre.Name}
                        </span>
                    ))}

                    {/*{series.Genres.length > 2 && (*/}
                    {/*    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">*/}
                    {/*      + ещё {series.Genres.length - 2}*/}
                    {/*    </span>*/}
                    {/*)}*/}
                    {series.Genres.length > 2 && (
                        <div
                            className="relative"
                            onMouseEnter={() => setTooltipVisible(true)}
                            onMouseLeave={() => setTooltipVisible(false)}
                        >
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full cursor-pointer">
                                + ещё {series.Genres.length - 2}
                            </span>

                            {isTooltipVisible && (
                                <div className="absolute z-10 top-full left-0 mt-2 w-max bg-gray-200 border border-gray-500 rounded shadow-lg p-2 text-xs text-gray-800 whitespace-nowrap">
                                    {series.Genres.map(g => g.Name).join(', ')}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <p className="text-gray-600 text-sm line-clamp-3">{series.ShortDescription || series.Description}</p>
            </div>

        </div>
    );
};

export default SeriesCard;