
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#004040]"></div>
      {/* Text removed, will be handled by parent component if needed */}
    </div>
  );
};

export default LoadingSpinner;
