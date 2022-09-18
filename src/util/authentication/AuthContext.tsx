import { createContext, useContext, useState } from 'react';

interface AuthenticatedUser {
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticationToSetTo: boolean) => void;
}

export const AuthContext = createContext<AuthenticatedUser>(
  {} as AuthenticatedUser
);

/**
 * Returns a AuthenticatedUser object that for Main app to pass down as context.
 */
export function useProvideAuth(): AuthenticatedUser {
  // needs to be true initiatially so routing works properly
  // authentication is checked with api call /api on app load so this is fine.
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return {
    isAuthenticated,
    setIsAuthenticated: (newState: boolean) => {
      setIsAuthenticated(newState);
    },
  };
}

/**
 * Hook that gets the authentication context.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
