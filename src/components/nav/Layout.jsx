import { auth } from '@/utils/firebase/firebase-config';
import { UserContext, SnackContext } from '@/utils/globalContext';
import { Box } from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import CustomSnackbar from '../ui/Snackbar';
import Footer from './Footer';
import Navbar from './Navbar';

function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    type: 'success',
    duration: 3000,
    message: '',
  });

  const { open, duration, message, type } = snack;

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser)
        setUser({
          uid: currentUser.uid,
          accessToken: currentUser.accessToken,
          displayName: currentUser.displayName,
          email: currentUser.email,
          phoneNumber: currentUser.phoneNumber,
        });
      // console.log('Auth state', currentUser);
    });
  }, [auth]);

  const setCurrentUser = (user) => {
    setUser(user);
  };

  const setSnackFunction = ({ open, duration, type, message }) => {
    if (open === true) {
      setSnack({ open, message, duration, type });
    } else {
      setSnack({ ...snack, open: false });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <UserContext.Provider
        value={{
          currentUser: user,
          setCurrentUser,
        }}
      >
        <SnackContext.Provider
          value={{
            open,
            type,
            duration,
            message,
            setSnack: setSnackFunction,
          }}
        >
          <Navbar />
          <Box sx={{ minHeight: '90vh' }}>{children}</Box>
          <Footer />
          <CustomSnackbar />
        </SnackContext.Provider>
      </UserContext.Provider>
    </Box>
  );
}

export default Layout;
