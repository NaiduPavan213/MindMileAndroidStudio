import React, { useState } from 'react';
import Post from '../feed/Post';
import CourseCard from '../feed/CourseCard';
import JobCard from '../feed/JobCard';
import { CourseItem, JobItem } from '../../App';
import { PostItem } from './HomeFeed'; // Use the more detailed PostItem type

type SavedItem = PostItem | JobItem | CourseItem;

const savedItemsData: {
    posts: PostItem[],
    jobs: JobItem[],
    courses: CourseItem[],
} = {
    posts: [
        { id: 1, type: 'post', author: 'Rohan Verma', title: 'M.Tech Student | Data Science Enthusiast', avatarUrl: 'https://picsum.photos/seed/rohan/100/100', time: '2h', content: 'Just finished a deep dive into Large Language Models! The architecture behind models like Gemini is fascinating...', likes: 125, comments: 18 },
    ],
    jobs: [
        { type: 'job', role: 'Frontend Developer Intern', company: 'Google', location: 'Bengaluru, India (Remote)', logoUrl: 'https://picsum.photos/seed/googlelogo/100/100' },
    ],
    courses: [
        { type: 'course', title: 'Advanced React Patterns', source: 'MindMile Originals', duration: '4h 20m', thumbnailUrl: 'https://picsum.photos/seed/react/600/300' },
    ]
};

const allItems: SavedItem[] = [...savedItemsData.posts, ...savedItemsData.jobs, ...savedItemsData.courses];

const FilterButton: React.FC<{ label: string; count: number; isActive: boolean; onClick: () => void }> = ({ label, count, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
            isActive ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
        }`}
    >
        {label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white text-purple-600' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-200'}`}>{count}</span>
    </button>
);

interface SavedItemsProps {
    setViewingCourse: (course: CourseItem) => void;
    setApplyingForJob: (job: JobItem) => void;
}

const SavedItems: React.FC<SavedItemsProps> = ({ setViewingCourse, setApplyingForJob }) => {
    const [activeFilter, setActiveFilter] = useState('All');

    const getFilteredItems = (): SavedItem[] => {
        switch(activeFilter) {
            case 'Posts': return savedItemsData.posts;
            case 'Jobs': return savedItemsData.jobs;
            case 'Courses': return savedItemsData.courses;
            case 'All':
            default: return allItems;
        }
    };

    const filteredItems = getFilteredItems();

    return (
        <div className="space-y-6">
            <div className="card p-4">
                <h2 className="text-xl font-bold">Saved Items</h2>
            </div>
            
            <div className="card p-2 flex items-center space-x-2">
                <FilterButton label="All" count={allItems.length} isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
                <FilterButton label="Posts" count={savedItemsData.posts.length} isActive={activeFilter === 'Posts'} onClick={() => setActiveFilter('Posts')} />
                <FilterButton label="Jobs" count={savedItemsData.jobs.length} isActive={activeFilter === 'Jobs'} onClick={() => setActiveFilter('Jobs')} />
                <FilterButton label="Courses" count={savedItemsData.courses.length} isActive={activeFilter === 'Courses'} onClick={() => setActiveFilter('Courses')} />
            </div>

            {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                    switch (item.type) {
                        // FIX: Removed onShare and onSend props as they are now handled by the context in the Post component.
                        case 'post': return <Post key={`post-${item.id}`} {...item} />;
                        case 'course': return <CourseCard key={`course-${index}`} {...item} onStartLearning={setViewingCourse} />;
                        case 'job': return <JobCard key={`job-${index}`} {...item} onApplyNow={setApplyingForJob} />;
                        default: return null;
                    }
                })
            ) : (
                <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
                    You have no saved items in this category.
                </div>
            )}
        </div>
    );
};

export default SavedItems;