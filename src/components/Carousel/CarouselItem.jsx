// src/components/CarouselItem.jsx
import React, { forwardRef } from 'react';

const CarouselItem = forwardRef(({ series, isCenter }, ref) => {
    return (
        <div
            ref={ref}
            className={`
                flex-shrink-0 relative
                w-40 h-[18rem] sm:w-52 sm:h-[24rem] lg:w-64 lg:h-[28rem] /* Новые, уменьшенные размеры */
                rounded-lg overflow-hidden shadow-lg
                transition-all duration-200 ease-in-out transform
                ${!isCenter ? 'hover:opacity-90 hover:scale-100' : ''}
                ${isCenter ? 'scale-110 opacity-100 z-20' : 'scale-90 opacity-70 z-10 brightness-75'}
                /* Уменьшаем отступы между карточками */
                ${isCenter ? 'mx-4 sm:mx-6 md:mx-8 lg:mx-10' : 'mx-1 sm:mx-2'} 
                snap-center
              `}
        >
            <img
                src={series.poster || 'https://via.placeholder.com/400x600?text=No+Image'}
                alt={series.title}
                className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xs sm:text-base font-bold mb-1">{series.title}</h3> {/* Возможно, уменьшим размер шрифта */}
                <p className="text-xs sm:text-sm font-semibold">Оценка: {series.rating.toFixed(1)} / 10</p> {/* Возможно, уменьшим размер шрифта */}
            </div>
        </div>
    );
});

export default CarouselItem;