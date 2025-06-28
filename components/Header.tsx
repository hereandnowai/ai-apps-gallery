
import React from 'react';
import { BRAND_INFO, PageType } from '../constants.ts';
import { User } from '../types.ts';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  // handleRefresh: () => void; // Removed
  currentPage: PageType;
  isAuthenticated: boolean;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  // handleRefresh, // Removed
  currentPage,
  isAuthenticated,
  currentUser,
  onLogout
}) => {
  const navLinkBaseStyle = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeNavLinkStyle = "bg-[#FFDF00] text-[#004040]";
  const inactiveNavLinkStyle = "text-slate-200 hover:bg-[#005050] hover:text-white";

  const placeholderText = currentPage === 'apps' ? 'Search Applications...' : 'Search Edu Games...';
  // const refreshLabel = `Refresh ${currentPage === 'apps' ? 'Applications' : 'Edu Games'} list`; // Removed

  return (
    <header className="bg-[#004040] shadow-lg sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center mb-4 xl:mb-0 w-full xl:w-auto">
            {/* Logo */}
            <a href={BRAND_INFO.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 mb-3 md:mb-0 md:mr-6">
              <img 
                src={BRAND_INFO.logoUrl} 
                alt={`${BRAND_INFO.shortName} Logo`} 
                className="h-12 sm:h-14 w-auto"
              />
            </a>
            {/* Navigation */}
            <nav className="flex space-x-2 sm:space-x-3">
              <a
                href="https://hereandnowai.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${navLinkBaseStyle} text-slate-200 hover:bg-[#005050] hover:text-white flex items-center justify-center`}
                aria-label="Home"
                title="Go to Home"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12L12 2.25l9.75 9.75M21 12v9.75a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75V16.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v5.25a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V12" />
                </svg>
              </a>
              <a 
                href="#apps" 
                className={`${navLinkBaseStyle} ${currentPage === 'apps' ? activeNavLinkStyle : inactiveNavLinkStyle}`}
                aria-current={currentPage === 'apps' ? 'page' : undefined}
              >
                Applications
              </a>
              <a 
                href="#edugames" 
                className={`${navLinkBaseStyle} ${currentPage === 'edugames' ? activeNavLinkStyle : inactiveNavLinkStyle}`}
                aria-current={currentPage === 'edugames' ? 'page' : undefined}
              >
                Edu Games
              </a>
              <a 
                href="#engineers" 
                className={`${navLinkBaseStyle} ${currentPage === 'engineers' ? activeNavLinkStyle : inactiveNavLinkStyle}`}
                aria-current={currentPage === 'engineers' ? 'page' : undefined}
              >
                AI Engineers
              </a>
            </nav>
            {isAuthenticated && currentUser && (
              <div className="md:ml-6 mt-3 md:mt-0 text-sm text-slate-200 flex items-center space-x-3">
                {currentUser.picture && (
                  <img 
                    src={currentUser.picture} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full border-2 border-[#FFDF00]"
                    referrerPolicy="no-referrer" // Important for Google profile pictures
                  />
                )}
                <span>Welcome, <span className="font-semibold text-[#FFDF00]">{currentUser.name}</span>!</span>
                <button 
                  onClick={onLogout}
                  className="px-3 py-1 border border-transparent rounded-md text-xs font-medium text-[#004040] bg-[#FFDF00] hover:bg-yellow-300 transition-colors"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Controls: Search, Category Filter - Always visible */}
          <div className="w-full xl:w-auto flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-4 xl:mt-0">
            <input
              type="text"
              placeholder={placeholderText}
              className="w-full sm:w-auto md:w-64 p-2.5 border border-slate-500 rounded-lg focus:ring-2 focus:ring-[#FFDF00] focus:border-[#FFDF00] bg-white text-sm text-slate-700 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={placeholderText}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto p-2.5 border border-slate-500 rounded-lg focus:ring-2 focus:ring-[#FFDF00] focus:border-[#FFDF00] bg-white text-sm text-slate-700"
              aria-label="Select category"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {/* Refresh Button Removed
            <button
              onClick={handleRefresh}
              className="w-full sm:w-auto bg-[#FFDF00] text-[#004040] px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
              aria-label={refreshLabel}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button> 
            */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
