import React, { useState, useEffect, useRef, useCallback } from 'react';
import {ArrowBigLeftDash, ArrowBigRightDash} from 'lucide-react';
import CarouselItem from './CarouselItem';
import {Link} from "react-router-dom";

const Carousel = ({ seriesData, Title }) => {
    const [currentIndex, setCurrentIndex] = useState(parseInt(seriesData.length / 2));
    const carouselScrollContainerRef = useRef(null);
    const itemRefs = useRef([]);
    const CarouselTitle = useState(Title)

    if (!seriesData || seriesData.length === 0) {
        return <div className="text-center text-gray-400 py-10">Нет данных для карусели.</div>;
    }

    const totalSeries = seriesData.length;

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSeries);
    }, [totalSeries]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prevIndex) => (totalSeries + prevIndex - 1) % totalSeries);
    }, [totalSeries]);

    useEffect(() => {
        const scrollToCenter = () => {
            const scrollContainer = carouselScrollContainerRef.current;
            const currentItem = itemRefs.current[currentIndex];

            if (scrollContainer && currentItem) {
                currentItem.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        };

        scrollToCenter();

        const observer = new ResizeObserver(() => {
            scrollToCenter();
        });

        if (carouselScrollContainerRef.current) {
            observer.observe(carouselScrollContainerRef.current);
        }

        const currentItems = itemRefs.current;
        currentItems.forEach(item => {
            if (item) observer.observe(item);
        });

        return () => {
            observer.disconnect();
        };
    }, [currentIndex, seriesData]);

    return (
        <div className="relative w-full bg-gray-50 rounded-xl shadow-lg">
            {/*<h2 className="text-indigo-600 text-3xl font-bold text-center mb-6 mt-6 bg-zinc-100">{CarouselTitle}</h2>*/}
            <div className="flex justify-center items-center pt-4">
                <div className="bg-zinc-200/20 rounded-xl pr-3 pl-3">
                    <h2 className="text-3xl font-bold text-indigo-600">{CarouselTitle}</h2>
                </div>
            </div>
            <div
                className="flex justify-center items-center w-full min-h-[calc(28rem*1.2)]">
                <button
                    onClick={goToPrev}
                    className="absolute left-2 sm:left-3 z-30 /* Немного уменьшил отступы кнопок */
                     p-2 sm:p-3 rounded-full bg-black bg-opacity-50
                     text-white text-xl sm:text-2xl font-bold
                     hover:bg-opacity-75 transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                    <ArrowBigLeftDash/>
                </button>

                {/* Контейнер для слайдов, который будет прокручиваться */}
                <div
                    ref={carouselScrollContainerRef}
                    className="flex items-center overflow-x-scroll
                     snap-x snap-mandatory scroll-smooth
                     hide-scrollbar
                     /* Уменьшаем padding для видимости боковых элементов, чтобы карусель стала компактнее */
                     px-10 sm:px-16 md:px-24 lg:px-32 xl:px-40
                     py-10 /* Сохраняем небольшой вертикальный padding */
          "
                >
                    {seriesData.map((series, index) => (
                        <Link key={series.id} to={`/serial/${series.id} `}>
                            <CarouselItem
                                key={series.id}
                                series={series}
                                isCenter={index === currentIndex}
                                ref={(el) => (itemRefs.current[index] = el)}
                            />
                        </Link>
                    ))}
                </div>

                {/* Кнопка "Вперед" */}
                <button
                    onClick={goToNext}
                    className="absolute right-2 sm:right-3 z-30 /* Немного уменьшил отступы кнопок */
                     p-2 sm:p-3 rounded-full bg-black bg-opacity-50
                     text-white text-xl sm:text-2xl font-bold
                     hover:bg-opacity-75 transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                    <ArrowBigRightDash/>
                </button>
            </div>
        </div>
    );
};

export default Carousel;