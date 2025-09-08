
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
import AIAssistantFab from './components/common/AIAssistantFab';

// Import page components
import HomeFeed from './components/pages/HomeFeed';
import MyNetwork from './components/pages/MyNetwork';
import Jobs from './components/pages/Jobs';
import Roadmaps from './components/pages/Roadmaps';
import Messaging from './components/pages/Messaging';
import Notifications from './components/pages/Notifications';
import Profile from './components/pages/Profile';
import Settings from './components/pages/Settings';
import ResumeBuilder from './components/pages/ResumeBuilder';
import SavedItems from './components/pages/SavedItems';
import CoursePage from './components/pages/CoursePage';
import JobApplicationPage from './components/pages/JobApplicationPage';
import RoadmapDetailPage from './components/pages/RoadmapDetailPage';
import { Roadmap } from './components/pages/Roadmaps';
import Premium from './components/pages/Premium';
import { useModal } from './contexts/ModalContext';


export type Page = 'Home' | 'My Network' | 'Jobs' | 'Roadmaps' | 'Messaging' | 'Notifications' | 'Profile' | 'Settings' | 'Resume Builder' | 'Saved Items' | 'Logout' | 'Premium';

// Define shared types for content items
export interface CourseItem {
    type: 'course';
    title: string;
    source: string;
    duration: string;
    thumbnailUrl: string;
}

export interface JobItem {
    type: 'job';
    role: string;
    company: string;
    location: string;
    logoUrl: string;
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Home');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { openModal } = useModal();
  
  // State for immersive page views
  const [viewingCourse, setViewingCourse] = useState<CourseItem | null>(null);
  const [applyingForJob, setApplyingForJob] = useState<JobItem | null>(null);
  const [viewingRoadmap, setViewingRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);


  const handleSetPage = (page: Page) => {
    if (page === 'Logout') {
      openModal('logout');
    } else {
      // Close any immersive views when changing main pages
      setViewingCourse(null);
      setApplyingForJob(null);
      setViewingRoadmap(null);
      setActivePage(page);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'Home':
        return <HomeFeed setViewingCourse={setViewingCourse} setApplyingForJob={setApplyingForJob} />;
      case 'My Network':
        return <MyNetwork />;
      case 'Jobs':
        return <Jobs setApplyingForJob={setApplyingForJob} />;
      case 'Roadmaps':
        return <Roadmaps setViewingRoadmap={setViewingRoadmap} />;
      case 'Messaging':
        return <Messaging />;
      case 'Notifications':
        return <Notifications />;
      case 'Profile':
        return <Profile />;
      case 'Settings':
        return <Settings theme={theme} setTheme={setTheme} />;
      case 'Saved Items':
        return <SavedItems setViewingCourse={setViewingCourse} setApplyingForJob={setApplyingForJob} />;
      default:
        return <HomeFeed setViewingCourse={setViewingCourse} setApplyingForJob={setApplyingForJob} />;
    }
  };
  
  const renderMainContent = () => {
    if (activePage === 'Premium') {
      return <Premium setActivePage={handleSetPage} />;
    }
    if (viewingCourse) {
        return <CoursePage course={viewingCourse} onClose={() => setViewingCourse(null)} />;
    }
    if (applyingForJob) {
        return <JobApplicationPage job={applyingForJob} onClose={() => setApplyingForJob(null)} />;
    }
    if (viewingRoadmap) {
        return <RoadmapDetailPage roadmap={viewingRoadmap} onClose={() => setViewingRoadmap(null)} setApplyingForJob={setApplyingForJob} />;
    }
    if (activePage === 'Resume Builder') {
        return <ResumeBuilder />;
    }
    return (
         <main className="container mx-auto px-4 py-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <aside className="hidden md:block md:col-span-3">
              <LeftSidebar setActivePage={handleSetPage} />
            </aside>
            <div className="col-span-1 md:col-span-6">
              {renderPage()}
            </div>
            <aside className="hidden md:block md:col-span-3">
              <RightSidebar setActivePage={handleSetPage} setViewingRoadmap={setViewingRoadmap} />
            </aside>
          </div>
        </main>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 antialiased min-h-screen flex flex-col">
      <Header activePage={activePage} setActivePage={handleSetPage} />
      
      {renderMainContent()}

      <AIAssistantFab />
    </div>
  );
};

export default App;