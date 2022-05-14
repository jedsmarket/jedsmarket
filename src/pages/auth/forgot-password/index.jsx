import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import SEO from '@/components/nav/SEO';
import Link from '@/components/nav/Link';
import { SnackContext } from '@/utils/globalContext';

import { auth } from '@/utils/firebase/firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/router';

function Index() {
  const [state, setState] = useState({
    email: '',
    loading: false,
  });

  const { email, loading } = state;

  const router = useRouter();

  const snackContext = useContext(SnackContext);

  const { setSnack } = snackContext;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setState({ ...state, loading: true });
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setSnack({
            type: 'success',
            duration: 3000,
            message: `A password reset link has been sent to your email!`,
            open: true,
          });
          setState({ ...state, loading: false });
          router.push('/');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setSnack({
            type: 'error',
            duration: 3000,
            message: `An error occurred`,
            open: true,
          });
        });
    } else {
      setSnack({
        type: 'error',
        duration: 3000,
        message: 'Email invalid',
        open: true,
      });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setState({ ...state, email: value });
  };

  return (
    <Box>
      <SEO title='Reset My Password' />
      <Grid container justifyContent='center'>
        <Grid item xs={12} my={3}>
          <Typography fullWidth align='center' variant='h4'>
            Reset Your Password
          </Typography>
        </Grid>
        <Grid item xs={11} sm={10} md={9} lg={8}>
          <Typography fullWidth align='center'>
            Have you forgotten your password? <br />
            Kindly enter your email below to reset your password.
          </Typography>
        </Grid>

        <Grid item xs={11} sm={10} md={9} lg={8} my={4}>
          <Box sx={{ width: '100%', heightt: '100%', boxShadow: 2, p: 3 }}>
            <form onSubmit={handleSubmit}>
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
                      Loading...
                    </Typography>
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
            <Box
              sx={{
                width: '100%',
                alignItems: 'center',
                my: 2,
                display: 'flex',
                justifyContent: 'right',
              }}
            >
              <Typography>
                <Link href='/auth/login'>Login</Link> or{' '}
                <Link href='/auth/register'>register</Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Index;
