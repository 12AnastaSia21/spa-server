import React, { createContext, useState, useContext } from 'react';

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

