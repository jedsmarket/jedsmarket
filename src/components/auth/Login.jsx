import { auth, db } from '@/utils/firebase/firebase-config';
import { UserContext } from '@/utils/globalContext';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import Link from '../nav/Link';
import SEO from '../nav/SEO';

function Login({ handleLogin, state, setState }) {
  const [visibility, setVisibility] = useState(false);
  const { password, email, loading } = state;

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const userContext = useContext(UserContext);

  const { setCurrentUser } = userContext;

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const googleHandler = () => {
    let provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account',
    });

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const currentUser = result.user;

        setCurrentUser({
          accessToken: currentUser.accessToken,
          displayName: currentUser.displayName,
          email: currentUser.email,
          phoneNumber: currentUser.phoneNumber,
        });

        const docRef = doc(db, 'users', currentUser.email);
        setDoc(docRef, {
          uid: currentUser.uid,
          name: currentUser.displayName,
          phoneNumber: currentUser.phoneNumber,
          email: currentUser.email,
        });

        router.push('/account');
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <Box>
      <SEO
        title='Login | JEDS Market'
        description='Log in to your JEDS Market account'
      />
      <Grid container justifyContent='center'>
        <Grid item xs={11} mt={3} mb={3}>
          <Typography variant='h4' align='center'>
            Login
          </Typography>
        </Grid>
        <Grid item xs={11} sm={10} md={9} lg={7}>
          <Button
            disableElevation
            fullWidth
            onClick={googleHandler}
            size='large'
            variant='outlined'
            sx={{
              color: 'grey.700',
              backgroundColor: theme.palette.grey[50],
              borderColor: theme.palette.grey[100],
            }}
          >
            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
              <img
                src={'/images/icons/social-google.svg'}
                alt='google'
                width={16}
                height={16}
                style={{ marginRight: matchDownSM ? 8 : 16 }}
              />
            </Box>
            Sign in with Google
          </Button>
        </Grid>
        <Grid item xs={11} sm={10} md={9} lg={7} my={2}>
          <Typography variant='body1' align='center' fontWeight='bold'>
            OR
          </Typography>
        </Grid>
        <Grid item xs={11} sm={10} md={9} lg={7}>
          <form onSubmit={handleLogin}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-email-login'>
                Email Address
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-email-login'
                type='text'
                value={email}
                name='email'
                onChange={handleChange}
                label='Email Address'
                inputProps={{}}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-password-login'>
                Password
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-password-login'
                type={visibility ? 'text' : 'password'}
                value={password}
                autoComplete='off'
                name='password'
                onChange={handleChange}
                label='Password'
                inputProps={{}}
              />
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Checkbox
                checked={visibility}
                onChange={(e) => setVisibility(!visibility)}
              />
              Show password
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'right',
                mb: 2,
              }}
            >
              <Link href='/auth/forgot-password'>Reset Password</Link>
            </Box>

            <Button
              type='submit'
              variant='contained'
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress color='inherit' size={20} />
                  <Typography variant='span' ml={1}>
                    Loading
                  </Typography>
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
