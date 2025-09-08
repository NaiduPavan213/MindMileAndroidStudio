import React, { useState } from 'react';
import CreatePost from '../feed/CreatePost';
import Post from '../feed/Post';
import CourseCard from '../feed/CourseCard';
import JobCard from '../feed/JobCard';

// FIX: Define types for each feed item and create a discriminated union
// to ensure type safety when rendering different components.
interface PostItem {
    type: 'post';
    id: number;
    author: string;
    title: string;
    avatarUrl: string;
    time: string;
    content: string;
    likes: number;
    comments: number;
}

interface CourseItem {
    type: 'course';
    title: string;
    source: string;
    duration: string;
    thumbnailUrl: string;
}

interface JobItem {
    type: 'job';
    role: string;
    company: string;
    location: string;
    logoUrl: string;
}

type FeedItem = PostItem | CourseItem | JobItem;


const feedItems: FeedItem[] = [
    {
        type: 'course',
        title: 'Advanced React Patterns',
        source: 'MindMile Originals',
        duration: '4h 20m',
        thumbnailUrl: 'https://picsum.photos/seed/react/600/300'
    },
    {
        type: 'post',
        id: 1,
        author: 'Rohan Verma',
        title: 'M.Tech Student | Data Science Enthusiast',
        avatarUrl: 'https://picsum.photos/seed/rohan/100/100',
        time: '2h',
        content: 'Just finished a deep dive into Large Language Models! The architecture behind models like Gemini is fascinating. It\'s amazing how far we\'ve come with natural language understanding. Anyone working on projects in this space? Would love to connect and share insights! #AI #LLM #DataScience',
        likes: 125,
        comments: 18,
    },
    {
        type: 'job',
        role: 'Frontend Developer Intern',
        company: 'Google',
        location: 'Bengaluru, India (Remote)',
        logoUrl: 'https://picsum.photos/seed/googlelogo/100/100',
    },
    {
        type: 'post',
        id: 2,
        author: 'Anjali Gupta',
        title: '12th Grade Student | Future Innovator',
        avatarUrl: 'https://picsum.photos/seed/anjali/100/100',
        time: '3d',
        content: 'Thrilled to share that I won the first prize at the National Science Fair for my project on sustainable urban farming! 🌿 It\'s been an incredible learning journey. Thanks to MindMile for the resources that helped me structure my research. On to the next challenge! #ScienceFair #Innovation #STEM',
        likes: 450,
        comments: 72,
    }
];

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
            isActive ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
        }`}
    >
        {label}
    </button>
);

const HomeFeed: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredFeed = feedItems.filter(item => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Courses') return item.type === 'course';
        if (activeFilter === 'Jobs') return item.type === 'job';
        if (activeFilter === 'Community') return item.type === 'post';
        return false;
    });

    return (
        <div className="space-y-6">
            <CreatePost />

            <div className="bg-white p-2 rounded-lg shadow-md flex items-center space-x-2">
                <FilterButton label="All" isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
                <FilterButton label="Courses" isActive={activeFilter === 'Courses'} onClick={() => setActiveFilter('Courses')} />
                <FilterButton label="Jobs" isActive={activeFilter === 'Jobs'} onClick={() => setActiveFilter('Jobs')} />
                <FilterButton label="Community" isActive={activeFilter === 'Community'} onClick={() => setActiveFilter('Community')} />
            </div>

            {filteredFeed.map((item, index) => {
                switch (item.type) {
                    case 'post':
                        // FIX: Removed onShare and onSend props as they are now handled by the context in the Post component.
                        return <Post key={`post-${item.id}`} {...item} />;
                    case 'course':
                        return <CourseCard key={`course-${index}`} {...item} onStartLearning={() => {}} />;
                    case 'job':
                        return <JobCard key={`job-${index}`} {...item} onApplyNow={() => {}} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default HomeFeed;