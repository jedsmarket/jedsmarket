import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import Link from './Link';

function Footer() {
  return (
    <Box
      sx={{
        alignSelf: 'flex-end',
        minWidth: '100%',
        minHeight: '100%',
        bgcolor: '#212121',
        color: 'white',
      }}
    >
      <Grid container justifyContent='center' my={2} px={2}>
        <Grid item xs={12}>
          <Typography variant='body2' color='inherit' align='center'>
            {'Copyright © '}
            <Link color='inherit' href='/'>
              jedsmarket.com
            </Link>{' '}
            {new Date().getFullYear()}.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
