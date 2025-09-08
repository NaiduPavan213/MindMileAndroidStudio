
import React, { useState } from 'react';
import { BriefcaseIcon, LocationIcon } from '../icons/CardIcons';
import { JobItem } from '../../App';

interface JobCardProps extends JobItem {
  onApplyNow: (job: JobItem) => void;
}

const JobCard: React.FC<JobCardProps> = (props) => {
  const { role, company, location, logoUrl, onApplyNow } = props;
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="card p-4">
      <div className="flex items-start space-x-4">
        <img src={logoUrl} alt={`${company} logo`} className="w-12 h-12 rounded-md" />
        <div>
          <a href="#" className="font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 hover:underline cursor-pointer">{role}</a>
          <p className="text-sm text-gray-600 dark:text-gray-300">{company}</p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <LocationIcon />
            <span className="ml-1">{location}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
         <button onClick={() => onApplyNow(props)} className="btn btn-primary flex-1">
            Apply Now
         </button>
         <button onClick={() => setIsSaved(!isSaved)} className={`btn flex-1 ${isSaved ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'btn-secondary'}`}>
            {isSaved ? 'Saved' : 'Save'}
         </button>
      </div>
    </div>
  );
};

export default JobCard;