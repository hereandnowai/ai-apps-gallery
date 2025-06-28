import React, { useEffect, useRef } from 'react';
import { User } from '../types';
import { BRAND_INFO } from '../constants';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
  appName?: string;
}

// Ensure this interface is defined if not globally available
interface CredentialResponse {
  credential?: string; // This is the ID token (JWT)
  select_by?: string;
  // other fields might exist, like 'clientId', 'select_by', etc.
}


const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onCancel, appName }) => {
  const googleButtonDiv = useRef<HTMLDivElement>(null);
  const CLIENT_ID = "938082795915-u86vj175dh6a6htf5hmoah3f17dv7bs0.apps.googleusercontent.com";

  const handleGoogleSignInCallback = (response: CredentialResponse) => {
    console.log("LoginPage: Google Sign-In Callback Received. Response:", response);
    if (response.credential) {
      try {
        // Basic JWT decoding (payload only, no signature verification client-side)
        // For production, always verify the token on your backend.
        const idToken = response.credential;
        const base64Url = idToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        console.log("LoginPage: Decoded ID Token:", decodedToken);

        const user: User = {
          id: decodedToken.sub, // Subject (user's Google ID)
          name: decodedToken.name,
          email: decodedToken.email,
          picture: decodedToken.picture,
        };
        onLoginSuccess(user);
      } catch (error) {
        console.error("LoginPage: Error decoding ID token or processing user data:", error);
        // Optionally, inform the user of an error
        alert("Login failed. Could not process user information.");
      }
    } else {
      console.error("LoginPage: Google Sign-In failed, no credential in response.");
      alert("Google Sign-In failed. Please try again.");
    }
  };

  useEffect(() => {
    if (typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.id) {
      console.warn("LoginPage: Google Identity Services script not loaded yet.");
      // You might want a fallback or a retry mechanism here, or display a message
      return;
    }

    if (!googleButtonDiv.current) {
      console.warn("LoginPage: Google button div not available.");
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleSignInCallback,
        auto_select: false, // Set to true for auto sign-in if a session exists
        // context: 'signin', // or 'signup', 'use'
        // ux_mode: 'popup', // or 'redirect'
      });

      window.google.accounts.id.renderButton(
        googleButtonDiv.current,
        { 
          theme: 'outline', 
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with', // or 'continue_with', etc.
          logo_alignment: 'left',
        } 
      );
      
      // Optional: Display the One Tap prompt if desired
      // window.google.accounts.id.prompt(); 

    } catch (error) {
      console.error("LoginPage: Error initializing or rendering Google Sign-In button:", error);
      // Fallback UI or error message
       if (googleButtonDiv.current) {
        googleButtonDiv.current.innerHTML = "<p class='text-red-500 text-sm'>Could not load Google Sign-In. Please try refreshing the page.</p>";
       }
    }
     // Cleanup function for when the component unmounts
    return () => {
      // It's good practice to see if GIS provides a way to unmount or cleanup a rendered button
      // For now, this is okay as the div will be removed from DOM.
      // If `google.accounts.id.disableAutoSelect()` was called, or if there's a specific cleanup for rendered buttons,
      // it would go here.
    };
  }, []);


  return (
    <div className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center p-4 z-[100]" role="dialog" aria-modal="true" aria-labelledby="login-dialog-title">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md transform transition-all">
        <div className="text-center">
          <img 
            src={BRAND_INFO.logoUrl} 
            alt={`${BRAND_INFO.shortName} Logo`} 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h2 id="login-dialog-title" className="text-2xl font-bold text-[#004040] mb-2">Sign In Required</h2>
          <p className="text-slate-600 mb-6">
            To access {appName ? <span className="font-semibold">{appName}</span> : 'this application'}, please sign in with your Google account.
          </p>
        </div>

        <div ref={googleButtonDiv} className="flex justify-center mb-4">
          {/* Google Sign-In button will be rendered here */}
          {/* Fallback text or loading indicator if needed before GIS loads */}
           <p className="text-slate-500 text-sm">Loading Google Sign-In...</p>
        </div>
        
        <button
          onClick={onCancel}
          className="w-full mt-4 text-sm text-slate-600 hover:text-[#004040] py-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#004040] focus:ring-opacity-50"
        >
          Cancel
        </button>
         <p className="text-xs text-slate-400 mt-6 text-center">
            Your information is handled securely. By signing in, you agree to our terms of service.
          </p>
      </div>
    </div>
  );
};

export default LoginPage;