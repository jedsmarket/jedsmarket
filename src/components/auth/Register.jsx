import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import SEO from '../nav/SEO';

function Register({ handleRegister, state, setState }) {
  const [visibility, setVisibility] = useState(false);
  const {
    email,
    name,
    phoneNumber,
    password,
    confirmPassword,
    errors,
    loading,
  } = state;

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    if (key === 'phoneNumber') {
      if (value.length <= 10) {
        setState({ ...state, [key]: value });
      } else {
        setState({
          ...state,
          snack: {
            duration: 4000,
            type: 'info',
            message: 'Please enter only 10 digits',
            open: true,
          },
        });
      }
    } else {
      setState({ ...state, [key]: value });
    }
  };

  return (
    <Box>
      <SEO
        title='Register | JEDS Market'
        description='Register for a JEDS Market account'
      />
      <Grid container justifyContent='center'>
        <Grid item xs={11} mt={3} mb={3}>
          <Typography variant='h4' fullWidth align='center'>
            Register
          </Typography>
        </Grid>
        <Grid item xs={11} mb={3}>
          <Typography variant='body2' fullWidth align='center'>
            Register with your email address
          </Typography>
        </Grid>
        <Grid item xs={11} sm={10} md={9} lg={7}>
          <form onSubmit={handleRegister} noValidate>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-name-register'>
                Name
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-name-register'
                type='text'
                value={name}
                name='name'
                onChange={handleChange}
                label='Name'
                inputProps={{}}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-phoneNumber-register'>
                Phone Number
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-phoneNumber-register'
                type='text'
                value={phoneNumber}
                name='phoneNumber'
                onChange={handleChange}
                label='Phone Number'
                inputProps={{}}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-email-register'>
                Email Address
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-email-register'
                type='text'
                value={email}
                name='email'
                onChange={handleChange}
                label='Email Address'
                inputProps={{}}
              />

              <FormHelperText id='standard-weight-helper-text-email-register'>
                We won't share your email with anyone
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-password-register'>
                Password
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-password-register'
                type={visibility ? 'text' : 'password'}
                value={password}
                autoComplete='off'
                name='password'
                onChange={handleChange}
                label='Password'
                inputProps={{}}
              />

              <FormHelperText id='standard-weight-helper-text-password-register'>
                Create new password
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-confirmPassword-register'>
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-confirmPassword-register'
                type={visibility ? 'text' : 'password'}
                autoComplete='off'
                value={confirmPassword}
                name='confirmPassword'
                onChange={handleChange}
                label='Confirm Password'
                inputProps={{}}
              />

              <FormHelperText id='standard-weight-helper-text-confirmPassword-register'>
                Confirm password
              </FormHelperText>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Checkbox
                checked={visibility}
                onChange={(e) => setVisibility(!visibility)}
              />
              Show password
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
                'Register'
              )}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Register;
