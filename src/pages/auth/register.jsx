import React, { useContext, useEffect, useState } from 'react';
import { auth } from '@/utils/firebase/firebase-config';
import { Box, Grid, Typography } from '@mui/material';
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';

import Link from '@/components/nav/Link';
import jwt from 'jsonwebtoken';
import {
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { SnackContext, UserContext } from '@/utils/globalContext';
import { useRouter } from 'next/router';
import Loading from '@/components/ui/Loading';

const validEmail = new RegExp(
  '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/'
);

function SignInScreen() {
  const [state, setState] = useState({
    email: '',
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    authType: 'register',
    errors: {},
    loading: true,
    snack: { duration: 4000, type: 'success', message: '', open: false },
  });

  const {
    email,
    name,
    phoneNumber,
    password,
    confirmPassword,
    authType,
    loading,
  } = state;

  const router = useRouter();

  const userContext = useContext(UserContext);

  const { currentUser, setCurrentUser } = userContext;

  const snackContext = useContext(SnackContext);

  const { setSnack } = snackContext;

  useEffect(() => {
    if (currentUser && currentUser !== null) {
      router.push('/account');
    } else {
      setState({ ...state, loading: false });
    }
  }, [currentUser]);

  // Configure FirebaseUI
  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      return setSnack({
        duration: 4000,
        type: 'error',
        message: 'Invalid email',
        open: true,
      });
    }

    if (!phoneNumber.match('^[0-9]{10}$')) {
      return setSnack({
        duration: 4000,
        type: 'error',
        message: 'Invalid phone number',
        open: true,
      });
    }

    if (password !== confirmPassword) {
      return setSnack({
        duration: 4000,
        type: 'error',
        message: 'Passwords do not match',
        open: true,
      });
    }

    if (password.length < 8) {
      return setSnack({
        duration: 4000,
        type: 'error',
        message: 'Password too short',
        open: true,
      });
    }

    setState({ ...state, loading: true });
    const token = jwt.sign(
      { email, name, phoneNumber, password },
      process.env.NEXT_PUBLIC_JWT_REGISTER,
      {
        expiresIn: '25m',
      }
    );

    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_CLIENT}/auth/${token}`,
      handleCodeInApp: true,
    };

    // console.log('Email register', email);

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        setState({
          ...state,
          email: '',
          name: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
        });
        setSnack({
          duration: 8000,
          type: 'success',
          open: true,
          message: `A verification link has been sent to your email, ${email}.`,
        });
        router.push('/');
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // ...
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setState({ ...state, loading: true });

    console.log('Logging in... ');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const currentUser = userCredential.user;
        setCurrentUser({
          accessToken: currentUser.accessToken,
          displayName: currentUser.displayName,
          email: currentUser.email,
          phoneNumber: currentUser.phoneNumber,
        });
        // console.log('Current user', userCredential);
        setState({ ...state, loading: false });
        router.push('/account');
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/user-not-found') {
          setSnack({
            duration: 4000,
            type: 'error',
            open: true,
            message: `Invalid email or password.`,
          });
          return setState({
            ...state,
            loading: false,
          });
        }

        setState({
          ...state,
          loading: false,
        });
        setSnack({
          duration: 4000,
          type: 'error',
          open: true,
          message: `Sorry, that did not work.`,
        });
      });
  };

  const handleAuthType = () => {
    return router.push('/auth/login');
    if (authType === 'login') {
      setState({
        ...state,
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        authType: 'register',
      });
    } else {
      setState({
        ...state,
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        authType: 'login',
      });
    }
  };

  return (
    <Box sx={{ minWidth: '100%', mb: 8 }}>
      <Grid container justifyContent='center'>
        <Grid
          item
          xs={11}
          sm={10}
          md={8}
          lg={6}
          sx={{ boxShadow: 3, mt: 6, p: 2 }}
        >
          {loading ? (
            <Loading />
          ) : authType === 'login' ? (
            <Login
              handleLogin={handleLogin}
              state={state}
              setState={setState}
            />
          ) : (
            <Register
              handleRegister={handleRegister}
              state={state}
              setState={setState}
            />
          )}
          <Box sx={{ minWidth: '100%', p: 2 }}>
            {loading ? (
              <>{null}</>
            ) : authType === 'login' ? (
              <Typography variant='body1' align='center' fullWidth>
                New here?{' '}
                <Link href='#' variant='text' onClick={handleAuthType}>
                  Register
                </Link>
              </Typography>
            ) : (
              <Typography variant='body1' align='center' fullWidth>
                Already have an account?{' '}
                <Link href='#' variant='text' onClick={handleAuthType}>
                  Login
                </Link>
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignInScreen;
