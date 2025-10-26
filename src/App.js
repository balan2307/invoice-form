import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import InvoiceForm from './components/InvoiceForm';
import { SessionManager, UserManager, FormDataManager } from './utils/sessionManager';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const initializeApp = () => {
      UserManager.initializeDefaultUsers();
      
      if (SessionManager.isLoggedIn()) {
        const userSession = SessionManager.getSession();
        setUser(userSession);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleLogin = (userSession) => {
    setUser(userSession);
    setIsAuthenticated(true);
  };

  const handleSignUp = (userSession) => {
    setUser(userSession);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    SessionManager.clearSession();
    FormDataManager.clearFormData();
    FormDataManager.clearPDFData();
    setUser(null);
    setIsAuthenticated(false);
    setAuthMode('login');
  };

  const switchToSignUp = () => {
    setAuthMode('signup');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginForm onLogin={handleLogin} onSwitchToSignUp={switchToSignUp} />
    ) : (
      <SignUpForm onSignUp={handleSignUp} onSwitchToLogin={switchToLogin} />
    );
  }

  return <InvoiceForm user={user} onLogout={handleLogout} />;
}

export default App;
