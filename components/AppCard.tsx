
import React from 'react';
import { AppInfo } from '../types.ts';

interface AppCardProps {
  app: AppInfo;
  onRequestAccess: (appUrl: string, appName: string) => void;
}

const statusColors: Record<string, string> = {
  live: 'bg-green-100 text-green-700',
  beta: 'bg-yellow-100 text-yellow-700',
  alpha: 'bg-blue-100 text-blue-700',
  deprecated: 'bg-red-100 text-red-700',
  'coming soon': 'bg-purple-100 text-purple-700',
};

const AppCard: React.FC<AppCardProps> = ({ app, onRequestAccess }) => {
  const currentStatus = app.status ? app.status.toLowerCase() : 'unknown';
  
  const handleExploreClick = () => {
    onRequestAccess(app.appUrl, app.name);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 transform">
      <img 
        src={app.imageUrl || 'https://picsum.photos/600/400?grayscale'} 
        alt={app.name} 
        className="w-full h-56 object-cover" 
        onError={(e) => (e.currentTarget.src = 'https://picsum.photos/600/400?grayscale&blur=2')}
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-[#004040]">{app.name}</h3>
            {app.status && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[currentStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {app.status.toUpperCase()}
                </span>
            )}
        </div>
        {app.category && <p className="text-sm text-[#FFDF00] bg-[#004040] px-2 py-0.5 rounded-full self-start mb-2 font-medium">{app.category}</p>}
        <p className="text-gray-600 text-sm mb-4 flex-grow min-h-[60px]">{app.description}</p>
        
        <div className="text-xs text-gray-500 mb-4 space-y-1">
          <p>ID: <span className="font-medium text-gray-600">{app.id}</span></p>
          {app.version && <p>Version: <span className="font-medium text-gray-600">{app.version}</span></p>}
          {app.lastUpdated && <p>Last Updated: <span className="font-medium text-gray-600">{app.lastUpdated}</span></p>}
          {app.ai_engineer && (
            <p>AI Engineer(s): <span className="font-medium text-gray-600">
              {Array.isArray(app.ai_engineer) ? app.ai_engineer.join(', ') : app.ai_engineer}
            </span></p>
          )}
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 mb-1">TAGS:</h4>
          <div className="flex flex-wrap gap-2">
            {app.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-teal-50 text-[#004040] rounded-full text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleExploreClick}
          className="mt-auto block w-full text-center bg-[#004040] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#005050] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFDF00] focus:ring-opacity-50"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default AppCard;
