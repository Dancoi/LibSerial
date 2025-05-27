// src/components/ScrollToTopButton/ScrollToTopButton.jsx
import React, { useState, useEffect } from 'react';
import {ArrowBigUpDash} from "lucide-react"; // Используем иконку стрелки вверх

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Плавная прокрутка
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50"> {/* Фиксированное позиционирование в правом нижнем углу */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-opacity duration-300"
                    title="Наверх"
                >
                    <ArrowBigUpDash/>
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;