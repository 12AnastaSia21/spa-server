import React, { createContext, useState, useContext, useEffect } from 'react';

interface TokenContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  const login = (token: string) => {
    setAuthToken(token); 
  };

  const logout = () => {
    setAuthToken(null); 
  };

  useEffect(() => {
    const token = window.localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token); 
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      window.localStorage.setItem('authToken', authToken); 
    } else {
      window.localStorage.removeItem('authToken'); 
    }
  }, [authToken]);

  return (
    <TokenContext.Provider value={{ authToken, login, logout }}>
      {children}
    </TokenContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(TokenContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

