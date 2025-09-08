
import React, { useState, useEffect } from 'react';
import { Page } from '../../App';
import { AIMentorIcon, AdvancedAnalyticsIcon, ExclusiveContentIcon } from '../icons/PageIcons';

interface PremiumPromoCardProps {
    setActivePage: (page: Page) => void;
}

const slides = [
    {
        icon: <AIMentorIcon className="w-8 h-8 text-purple-600 dark:text-purple-400"/>,
        title: "Unlock Your AI Mentor",
        description: "Get personalized guidance and feedback.",
    },
    {
        icon: <AdvancedAnalyticsIcon className="w-8 h-8 text-purple-600 dark:text-purple-400"/>,
        title: "Advanced Analytics",
        description: "See who's viewing your profile and track your progress.",
    },
    {
        icon: <ExclusiveContentIcon className="w-8 h-8 text-purple-600 dark:text-purple-400"/>,
        title: "Exclusive Content",
        description: "Access premium courses and workshops.",
    }
];

const PremiumPromoCard: React.FC<PremiumPromoCardProps> = ({ setActivePage }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearTimeout(timer);
    }, [currentSlide]);
    
    return (
        <div className="card p-4 text-center overflow-hidden">
             <div className="relative h-28">
                {slides.map((slide, index) => (
                    <div 
                        key={index} 
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="flex flex-col items-center justify-center h-full">
                            {slide.icon}
                            <p className="font-bold text-gray-800 dark:text-gray-100 mt-2">{slide.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>
             <div className="flex justify-center space-x-2 my-2">
                {slides.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}></button>
                ))}
            </div>
            <button 
                onClick={() => setActivePage('Premium')} 
                className="btn w-full mt-2 border border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
                Try Premium for Free
            </button>
        </div>
    );
};

export default PremiumPromoCard;