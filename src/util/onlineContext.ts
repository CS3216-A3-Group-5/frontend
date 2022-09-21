import { createContext, useContext, useState } from 'react';

interface OnlineStatus {
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
}

// global varaible that tracks if user is online
export const OnlineContext = createContext<OnlineStatus>({} as OnlineStatus);

export function useProvideOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState(true);
  return {
    isOnline,
    setIsOnline: (newStatus: boolean) => {
      setIsOnline(newStatus);
    },
  };
}

export function useIsOnline() {
  return useContext(OnlineContext);
}
