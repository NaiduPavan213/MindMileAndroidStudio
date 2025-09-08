
import React from 'react';

interface PostStub {
  author: string;
  content: string;
}

interface SendModalProps {
    post: PostStub;
    onClose: () => void;
}

const connections = [
    { name: 'Rohan Verma', avatar: 'https://picsum.photos/seed/rohan/100/100'},
    { name: 'Anjali Gupta', avatar: 'https://picsum.photos/seed/anjali/100/100'},
    { name: 'Raj Singh', avatar: 'https://picsum.photos/seed/mentor/100/100'},
];

const SendModal: React.FC<SendModalProps> = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="card w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Send Post</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">&times;</button>
            </div>
            <div className="p-4">
                <input type="text" placeholder="Search for connections..." className="input-field" />
                <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                    {connections.map(conn => (
                        <label key={conn.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                            <img src={conn.avatar} alt={conn.name} className="w-8 h-8 rounded-full" />
                            <span className="text-sm font-semibold">{conn.name}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex justify-end p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button onClick={onClose} className="btn btn-secondary mr-2">
                    Cancel
                </button>
                <button onClick={onClose} className="btn btn-primary">
                    Send
                </button>
            </div>
        </div>
    </div>
  );
};

export default SendModal;