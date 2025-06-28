
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppInfo, User, EngineerInfo } from './types.ts'; 
import { API_URL_APPS, API_URL_EDUGAMES, API_URL_ENGINEERS, PageType } from './constants.ts'; 
import Header from './components/Header.tsx'; 
import Footer from './components/Footer.tsx'; 
import AppCard from './components/AppCard.tsx'; 
import LoadingSpinner from './components/LoadingSpinner.tsx';
import LoginPage from './components/LoginPage.tsx'; // Import LoginPage
import EngineersPage from './components/EngineersPage.tsx'; // Import EngineersPage

const App: React.FC = () => {
  const [currentData, setCurrentData] = useState<AppInfo[]>([]);
  const [engineerData, setEngineerData] = useState<EngineerInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [animatedItemCount, setAnimatedItemCount] = useState<number>(0);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginPage, setShowLoginPage] = useState<boolean>(false);
  const [loginRedirectUrl, setLoginRedirectUrl] = useState<string | null>(null);
  const [loginTargetAppName, setLoginTargetAppName] = useState<string | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === 'edugames') return 'edugames';
    if (hash === 'engineers') return 'engineers';
    return 'apps';
  });

  // Load auth state from localStorage on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedAuthStatus = localStorage.getItem('isAuthenticated');
      if (storedUser && storedAuthStatus === 'true') {
        const user = JSON.parse(storedUser) as User;
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("App: User session restored from localStorage.");
      }
    } catch (e) {
      console.error("App: Error reading auth state from localStorage", e);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }, []);

  // Persist auth state to localStorage
  useEffect(() => {
    try {
      if (isAuthenticated && currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }
    } catch (e) {
      console.error("App: Error writing auth state to localStorage", e);
    }
  }, [isAuthenticated, currentUser]);


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'edugames') setCurrentPage('edugames');
      else if (hash === 'engineers') setCurrentPage('engineers');
      else setCurrentPage('apps');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const fetchData = useCallback(async (page: PageType) => {
    setIsLoading(true);
    setError(null);
    
    let apiUrl: string;
    let pageName: string;

    if (page === 'apps') {
      apiUrl = API_URL_APPS;
      pageName = 'applications';
    } else if (page === 'edugames') {
      apiUrl = API_URL_EDUGAMES;
      pageName = 'edu games';
    } else if (page === 'engineers') {
      apiUrl = API_URL_ENGINEERS;
      pageName = 'AI engineers';
    } else {
      setError("Unknown page type.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}?_=${new Date().getTime()}`); // Cache busting
      if (!response.ok) {
        throw new Error(`Failed to fetch ${pageName}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error(`Fetched ${pageName} data is not an array:`, data);
        throw new Error(`Invalid data format received for ${pageName} from server.`);
      }
      if (page === 'engineers') {
        setEngineerData(data);
      } else {
        setCurrentData(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`An unknown error occurred while fetching ${pageName}.`);
      }
      if (page === 'engineers') {
        setEngineerData([]);
      } else {
        setCurrentData([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []); // isAuthenticated removed from dependency array, fetchData doesn't directly depend on it for its core logic

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);
  
  useEffect(() => {
    if (currentPage === 'engineers') {
      setAnimatedItemCount(0);
      return;
    }

    if (isLoading || error) {
      if (isLoading) setAnimatedItemCount(0); 
      return;
    }

    const targetCount = currentData.length;

    if (targetCount === 0) {
      setAnimatedItemCount(0);
      return;
    }

    setAnimatedItemCount(0); 
    let currentAnimatedValue = 0;
    const totalAnimationTimeGoal = 1000;
    let stepDuration = Math.round(totalAnimationTimeGoal / targetCount);
    stepDuration = Math.max(30, Math.min(stepDuration, 200));

    const intervalId = setInterval(() => {
      currentAnimatedValue += 1;
      if (currentAnimatedValue <= targetCount) {
        setAnimatedItemCount(currentAnimatedValue);
      }
      if (currentAnimatedValue >= targetCount) {
        clearInterval(intervalId);
      }
    }, stepDuration);

    return () => clearInterval(intervalId);
  }, [currentData, isLoading, error, currentPage]);

  const categories = useMemo(() => {
    if (currentPage === 'engineers') return [];
    const allCategories = currentData
      .map(item => item.category)
      .filter((category): category is string => !!category);
    const uniqueCategories = Array.from(new Set(allCategories)).sort();
    const pageCategoryName = currentPage === 'apps' ? 'Applications' : 'Edu Games';
    return [`All ${pageCategoryName} Categories`, ...uniqueCategories];
  }, [currentData, currentPage]);
  
  useEffect(() => {
    if (currentPage === 'engineers') {
      setSearchTerm('');
      setSelectedCategory('');
      return;
    }
    if (categories.length > 0 && (selectedCategory === '' || !categories.includes(selectedCategory))) {
       setSelectedCategory(categories[0]); 
    }
  }, [categories, selectedCategory, currentPage]);


  const filteredData = useMemo(() => {
    if (currentPage === 'engineers') return [];
    const pageCategoryName = currentPage === 'apps' ? 'Applications' : 'Edu Games';
    return currentData.filter(item => {
      const matchesSearchTerm = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || 
        selectedCategory === `All ${pageCategoryName} Categories` || 
        item.category === selectedCategory;

      return matchesSearchTerm && matchesCategory;
    });
  }, [currentData, searchTerm, selectedCategory, currentPage]);

  // const handleRefresh = () => { // Removed
  //   fetchData(currentPage);
  // };
  
  const pageTitleName = currentPage === 'apps' ? 'Applications' : (currentPage === 'edugames' ? 'Edu Games' : 'AI Engineers');
  const itemPlural = animatedItemCount !== 1 ? 's' : '';
  const itemSingular = currentPage === 'apps' ? 'App' : 'Edu Game';


  const headingText = useMemo(() => {
    if (currentPage === 'engineers') return "Meet Our Talented AI Engineers";
    if (isLoading) {
      return `Our ${pageTitleName} Suite`;
    }
    if (error) {
      return `Our ${pageTitleName} Suite`; 
    }
    if (currentData.length === 0 && !isLoading && !error) {
        return `Our ${pageTitleName} Suite`;
    }
    return `Discover Our ${animatedItemCount} Amazing ${itemSingular}${itemPlural}`;
  }, [isLoading, error, currentData.length, animatedItemCount, pageTitleName, itemSingular, itemPlural, currentPage]);

  const subHeadingText = useMemo(() => {
    if (currentPage === 'engineers') return "The brilliant minds behind HERE AND NOW AI's innovative applications and educational games.";
    const baseText = `Discover innovative ${currentPage === 'apps' ? 'solutions' : 'educational game experiences'} built by HERE AND NOW AI.`;
    if (isLoading) {
      return `Loading ${pageTitleName}... ${baseText}`;
    }
    if (error) {
      return `Could not load ${pageTitleName}. ${baseText}`;
    }
    if (currentData.length > 0) {
      return `Explore ${pageTitleName} designed to push the boundaries of artificial intelligence.`;
    }
    return `No ${pageTitleName} currently available. ${baseText}`;
  }, [isLoading, error, currentData.length, currentPage, pageTitleName]);

  const noItemsMatchText = `No ${pageTitleName.toLowerCase()} match your current filters.`;
  const noItemsFoundText = `No ${pageTitleName.toLowerCase()} found.`;
  const allCategoriesText = `All ${pageTitleName} Categories`;

  // --- Authentication Logic ---
  const handleRequestAppAccess = (appUrl: string, appName: string) => {
    console.log("App: handleRequestAppAccess called for", appName, appUrl);
    if (isAuthenticated) {
      console.log("App: User authenticated, opening URL:", appUrl);
      window.open(appUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log("App: User not authenticated, showing login page for", appName);
      setLoginTargetAppName(appName);
      setLoginRedirectUrl(appUrl);
      setShowLoginPage(true);
    }
  };

  const handleGoogleLoginSuccess = (user: User) => {
    console.log("App: Google Login Success. User:", user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowLoginPage(false);
    
    alert(`Welcome, ${user.name}!\nYou are now signed in.\n\nYou will be redirected to ${loginTargetAppName || 'the application'}.`);

    if (loginRedirectUrl) {
      console.log("App: Redirecting to:", loginRedirectUrl);
      window.open(loginRedirectUrl, '_blank', 'noopener,noreferrer');
      setLoginRedirectUrl(null);
      setLoginTargetAppName(undefined);
    }
  };

  const handleLogout = () => {
    console.log("App: User logging out.");
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Optional: Clear search and category on logout to reset view
    // setSearchTerm('');
    // setSelectedCategory(categories.length > 0 ? categories[0] : '');
    alert("You have been logged out.");
  };

  const handleCloseLoginPage = () => {
    console.log("App: Login page cancelled.");
    setShowLoginPage(false);
    setLoginRedirectUrl(null);
    setLoginTargetAppName(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        // handleRefresh={handleRefresh} // Removed
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      {showLoginPage && (
        <LoginPage 
          onLoginSuccess={handleGoogleLoginSuccess} 
          onCancel={handleCloseLoginPage}
          appName={loginTargetAppName}
        />
      )}
      {!showLoginPage && currentPage === 'engineers' && (
        <EngineersPage 
          engineers={engineerData}
          isLoading={isLoading}
          error={error}
        />
      )}
      {!showLoginPage && currentPage !== 'engineers' && (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-10 text-center">
              <h2 
                className="text-4xl font-extrabold text-[#004040] mb-3 min-h-[48px] sm:min-h-[56px]" 
                aria-live="polite"
              >
                {headingText}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto min-h-[56px] sm:min-h-[auto]">
                {subHeadingText}
              </p>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}
          {error && !isLoading && (
            <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong.</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => fetchData(currentPage)} // Directly call fetchData for retry
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          {!isLoading && !error && filteredData.length === 0 && (
            <div className="text-center py-20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-slate-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <p className="text-xl text-slate-500">
                  {currentData.length > 0 ? noItemsMatchText : noItemsFoundText}
              </p>
              {currentData.length > 0 && (searchTerm || (selectedCategory && selectedCategory !== allCategoriesText)) && ( // isAuthenticated condition removed for clear filters
                  <button 
                    onClick={() => { 
                      setSearchTerm(''); 
                      setSelectedCategory(allCategoriesText); 
                    }} 
                    className="mt-4 text-[#004040] hover:underline"
                  >
                    Clear Filters
                  </button>
              )}
            </div>
          )}
          {!isLoading && !error && filteredData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.map(item => (
                <AppCard key={item.id} app={item} onRequestAccess={handleRequestAppAccess} />
              ))}
            </div>
          )}
        </main>
      )}
      <Footer />
    </div>
  );
};

export default App;
