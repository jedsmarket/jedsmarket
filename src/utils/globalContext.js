import { createContext } from 'react';

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

export const SnackContext = createContext({
  open: true,
  type: 'error',
  duration: 4000,
  message: '',
  setSnack: () => {},
});
