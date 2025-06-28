
import React, { useState, useEffect } from 'react';
import { EngineerInfo } from '../types';

interface EngineersPageProps {
  engineers: EngineerInfo[];
  isLoading: boolean;
  error: string | null;
}

const EngineersPage: React.FC<EngineersPageProps> = ({ engineers, isLoading, error }) => {
  const [currentMonthYear, setCurrentMonthYear] = useState<string>('');

  useEffect(() => {
    const updateMonthYear = () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1); // Go back one month
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      setCurrentMonthYear(`${month} ${year}`);
    };

    updateMonthYear(); // Set initially
    const intervalId = setInterval(updateMonthYear, 1000 * 60 * 60 * 24); // Update daily

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const engineerOfTheMonth = engineers.find(eng => eng.isEngineerOfTheMonth);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-4xl font-extrabold text-[#004040] mb-6 text-center">Our AI Engineers</h2>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-xl text-slate-500">Loading engineers...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong.</h3>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {engineerOfTheMonth && (
            <div className="bg-[#FFDF00] p-6 rounded-lg shadow-lg mb-10 text-center">
              <h3 className="text-3xl font-bold text-[#004040] mb-4">AI Engineer of the Month - {currentMonthYear}!</h3>
              <img 
                src={engineerOfTheMonth.photoUrl} 
                alt={engineerOfTheMonth.name} 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[#004040]"
              />
              <p className="text-2xl font-semibold text-[#004040]">{engineerOfTheMonth.name}</p>
              <p className="text-lg text-[#004040] mt-2">{engineerOfTheMonth.role}</p>
              <p className="text-md text-[#004040] mt-1">{engineerOfTheMonth.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {engineers.map(engineer => (
              <div key={engineer.id} className="bg-white rounded-lg shadow-md p-6 text-center">
                <img 
                  src={engineer.photoUrl} 
                  alt={engineer.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-slate-300"
                />
                <h4 className="text-xl font-semibold text-[#004040]">{engineer.name}</h4>
                <p className="text-md text-slate-600 mt-1">{engineer.role}</p>
                <p className="text-sm text-slate-500 mt-2">{engineer.bio}</p>
                {engineer.githubUrl && (
                  <a 
                    href={engineer.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#004040] hover:underline mt-3 inline-block text-sm"
                  >
                    GitHub Profile
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EngineersPage;
