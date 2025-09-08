
import React from 'react';
import { PlayIcon, ArticleIcon } from '../icons/CardIcons';
import { CourseItem } from '../../App';

interface CourseCardProps extends CourseItem {
  onStartLearning: (course: CourseItem) => void;
}

const CourseCard: React.FC<CourseCardProps> = (props) => {
  const { title, source, duration, thumbnailUrl, onStartLearning } = props;
  
  return (
    <div className="card">
        <div className="relative">
            <img src={thumbnailUrl} alt={title} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <PlayIcon />
            </div>
        </div>
      <div className="p-4">
        <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{source}</p>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">{title}</h4>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
          <ArticleIcon />
          <span className="ml-2">{duration}</span>
        </div>
      </div>
       <div className="px-4 pb-4">
            <button 
              onClick={() => onStartLearning(props)} 
              className="btn btn-primary w-full"
            >
                Start Learning
            </button>
       </div>
    </div>
  );
};

export default CourseCard;