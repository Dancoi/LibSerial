// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Carousel from '../components/Carousel/Carousel.jsx';
// import { Link } from 'react-router-dom';
//
// const CompilationPage = () => {
//     const [series, setSeries] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//
//     useEffect(() => {
//         const fetchSeries = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8080/api/series");
//
//                 const fetchedRawSeries = response.data;
//
//
//                 const transformedSeries = fetchedRawSeries.map(s => ({
//                     id: s.ID, // Используем s.ID
//                     title: s.Title,
//                     description: s.Description,
//                     releaseYear: s.Year,
//                     rating: s.Rating,
//                     genres: s.Genres ? s.Genres.map(genre => genre.Name) : [],
//                     poster: s.PosterURL,
//                     backdropURL: s.BackdropURL,
//                     shortDescription: s.ShortDescription,
//                     ageRating: s.AgeRating,
//                 }));
//
//                 setSeries(transformedSeries);
//
//             } catch (err) {
//                 console.error("Ошибка при получении данных:", err);
//                 setError(err.response?.data?.message || 'Ошибка при загрузке сериалов');
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchSeries();
//     }, []);
//
//     const seriesByGenre = series.reduce((acc, show) => {
//         if (show.genres && Array.isArray(show.genres)) {
//             show.genres.forEach(genreName => {
//                 const name = genreName.toLowerCase();
//                 if (!acc[name]) {
//                     acc[name] = [];
//                 }
//                 acc[name].push(show);
//             });
//         }
//         return acc;
//     }, {});
//
//     const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
//
//     return (
//         <div className="px-4 py-8 text-white min-h-screen">
//             <h1 className="text-4xl font-bold text-center text-indigo-600 mb-10">
//                 Подборки по жанрам
//             </h1>
//
//             {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//                 </div>
//             ) : error ? (
//                 <div className="text-center text-red-500 text-lg">{error}</div>
//             ) : (
//                 Object.entries(seriesByGenre).map(([genre, shows], ) => (
//                     <div key={genre} className="mb-12">
//                         <h2 className="text-3xl font-semibold text-center text-indigo-600 uppercase tracking-wide mb-6">
//                             {capitalize(genre)}
//                         </h2>
//                         <Carousel seriesData={shows} />
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };
//
// export default CompilationPage;
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Carousel from '../components/Carousel/Carousel.jsx';

const CompilationPage = () => {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const genreRefs = useRef({});

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/series");
                const fetchedRawSeries = response.data;

                const transformedSeries = fetchedRawSeries.map(s => ({
                    id: s.ID,
                    title: s.Title,
                    description: s.Description,
                    releaseYear: s.Year,
                    rating: s.Rating,
                    genres: s.Genres ? s.Genres.map(genre => genre.Name) : [],
                    poster: s.PosterURL,
                    backdropURL: s.BackdropURL,
                    shortDescription: s.ShortDescription,
                    ageRating: s.AgeRating,
                }));

                setSeries(transformedSeries);

            } catch (err) {
                console.error("Ошибка при получении данных:", err);
                setError(err.response?.data?.message || 'Ошибка при загрузке сериалов');
            } finally {
                setLoading(false);
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 50);
            }
        };

        fetchSeries();
    }, []);

    const seriesByGenre = series.reduce((acc, show) => {
        if (show.genres && Array.isArray(show.genres)) {
            show.genres.forEach(genreName => {
                const name = genreName.toLowerCase();
                if (!acc[name]) {
                    acc[name] = [];
                }
                acc[name].push(show);
            });
        }
        return acc;
    }, {});

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const scrollToGenre = (genre) => {
        const lowerCaseGenre = genre.toLowerCase();
        if (genreRefs.current[lowerCaseGenre]) {
            genreRefs.current[lowerCaseGenre].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <div className="px-4 py-8 text-white min-h-screen">
            <h1 className="text-4xl font-bold text-center text-indigo-600 mb-10">
                Подборки по жанрам
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 text-lg">{error}</div>
            ) : (
                <>
                    {Object.keys(seriesByGenre).length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 mb-10 p-4 bg-gray-500/20 rounded-lg shadow-lg">
                            {Object.keys(seriesByGenre).sort().map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => scrollToGenre(genre)}
                                    className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-200 ease-in-out text-sm md:text-base"
                                >
                                    {capitalize(genre)}
                                </button>
                            ))}
                        </div>
                    )}

                    {Object.entries(seriesByGenre).map(([genre, shows]) => (
                        <div key={genre} className="mb-12">
                            <h2
                                className="text-3xl font-semibold text-center text-indigo-600 uppercase tracking-wide mb-6"
                                ref={el => (genreRefs.current[genre] = el)}
                            >
                                {capitalize(genre)}
                            </h2>
                            <Carousel seriesData={shows} />
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default CompilationPage;