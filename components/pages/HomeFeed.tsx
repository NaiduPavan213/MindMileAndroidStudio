import React, { useState, useEffect } from 'react';
import CreatePost from '../feed/CreatePost';
import Post from '../feed/Post';
import CourseCard from '../feed/CourseCard';
import JobCard from '../feed/JobCard';
import { CourseItem, JobItem } from '../../App';
import QuestionPostCard from '../feed/QuestionPostCard';
import ProjectPostCard from '../feed/ProjectPostCard';
import ArticlePostCard from '../feed/ArticlePostCard';
import { useModal } from '../../contexts/ModalContext';

// --- TYPE DEFINITIONS ---
export interface PostItem {
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

export interface QuestionItem {
    type: 'question';
    id: number;
    author: string;
    avatarUrl: string;
    time: string;
    question: string;
    details: string;
    tags: string[];
}

export interface ProjectItem {
    type: 'project';
    id: number;
    author: string;
    avatarUrl: string;
    time: string;
    projectTitle: string;
    description: string;
    projectLink: string;
    imageUrl?: string;
}

export interface ArticleItem {
    type: 'article';
    id: number;
    author: string;
    avatarUrl: string;
    time: string;
    articleTitle: string;
    content: string;
}

export type FeedItem = PostItem | CourseItem | JobItem | QuestionItem | ProjectItem | ArticleItem;

const initialFeedItems: FeedItem[] = [
    { id: 1, type: 'post', author: 'Rohan Verma', title: 'M.Tech Student | Data Science Enthusiast', avatarUrl: 'https://picsum.photos/seed/rohan/100/100', time: '2h', content: 'Just finished a deep dive into Large Language Models! The architecture behind models like Gemini is fascinating. It\'s amazing how far we\'ve come with natural language understanding. Anyone working on projects in this space? Would love to connect and share insights! #AI #LLM #DataScience', likes: 125, comments: 18 },
    { type: 'job', role: 'Frontend Developer Intern', company: 'Google', location: 'Bengaluru, India (Remote)', logoUrl: 'https://picsum.photos/seed/googlelogo/100/100' },
    { type: 'course', title: 'Advanced React Patterns', source: 'MindMile Originals', duration: '4h 20m', thumbnailUrl: 'https://picsum.photos/seed/react/600/300' },
    { id: 2, type: 'post', author: 'Anjali Gupta', title: '12th Grade Student | Future Innovator', avatarUrl: 'https://picsum.photos/seed/anjali/100/100', time: '3d', content: 'Thrilled to share that I won the first prize at the National Science Fair for my project on sustainable urban farming! 🌿 It\'s been an incredible learning journey. Thanks to MindMile for the resources that helped me structure my research. On to the next challenge! #ScienceFair #Innovation #STEM', likes: 450, comments: 72 }
];

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${ isActive ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600' }`}>
        {label}
    </button>
);

interface HomeFeedProps {
    setViewingCourse: (course: CourseItem) => void;
    setApplyingForJob: (job: JobItem) => void;
}

const HomeFeed: React.FC<HomeFeedProps> = ({ setViewingCourse, setApplyingForJob }) => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
    const [activeFilter, setActiveFilter] = useState('All');
    const { setModalProps } = useModal();

    const currentUser = { name: 'Priya Sharma', avatarUrl: 'https://picsum.photos/seed/user/100/100' };

    // --- Handlers for adding new content to the feed ---
    const addContentToFeed = (newItem: FeedItem) => {
        setFeedItems(prevItems => [newItem, ...prevItems]);
    };

    // FIX: Use useEffect to set modal props. This is the correct way to handle side effects
    // and ensures the callbacks are always up-to-date without causing render-time side effects.
    useEffect(() => {
        setModalProps({
            onPostQuestion: (data) => {
                const newQuestion: QuestionItem = {
                    id: Date.now(), type: 'question', author: currentUser.name, avatarUrl: currentUser.avatarUrl,
                    time: 'Just now', question: data.question, details: data.details, tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                };
                addContentToFeed(newQuestion);
            },
            onShareProject: (data) => {
                const newProject: ProjectItem = {
                    id: Date.now(), type: 'project', author: currentUser.name, avatarUrl: currentUser.avatarUrl,
                    time: 'Just now', projectTitle: data.title, description: data.description, projectLink: data.link,
                    imageUrl: `https://picsum.photos/seed/${Date.now()}/600/300`,
                };
                addContentToFeed(newProject);
            },
            onWriteArticle: (data) => {
                const newArticle: ArticleItem = {
                    id: Date.now(), type: 'article', author: currentUser.name, avatarUrl: currentUser.avatarUrl,
                    time: 'Just now', articleTitle: data.title, content: data.content,
                };
                addContentToFeed(newArticle);
            },
        });
    }, [setModalProps, currentUser.name, currentUser.avatarUrl]); // Dependencies ensure this updates if user changes

    const filteredFeed = feedItems.filter(item => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Courses') return item.type === 'course';
        if (activeFilter === 'Jobs') return item.type === 'job';
        if (activeFilter === 'Community') return ['post', 'question', 'project', 'article'].includes(item.type);
        return false;
    });

    return (
        <div className="space-y-6">
            <CreatePost />

            <div className="card p-2 flex items-center space-x-2">
                <FilterButton label="All" isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
                <FilterButton label="Courses" isActive={activeFilter === 'Courses'} onClick={() => setActiveFilter('Courses')} />
                <FilterButton label="Jobs" isActive={activeFilter === 'Jobs'} onClick={() => setActiveFilter('Jobs')} />
                <FilterButton label="Community" isActive={activeFilter === 'Community'} onClick={() => setActiveFilter('Community')} />
            </div>

            {filteredFeed.map((item, index) => {
                switch (item.type) {
                    case 'post': return <Post key={`post-${item.id}`} {...item} />;
                    case 'course': return <CourseCard key={`course-${index}`} {...item} onStartLearning={setViewingCourse} />;
                    case 'job': return <JobCard key={`job-${index}`} {...item} onApplyNow={setApplyingForJob} />;
                    case 'question': return <QuestionPostCard key={`question-${item.id}`} {...item} />;
                    case 'project': return <ProjectPostCard key={`project-${item.id}`} {...item} />;
                    case 'article': return <ArticlePostCard key={`article-${item.id}`} {...item} />;
                    default: return null;
                }
            })}
        </div>
    );
};

export default HomeFeed;