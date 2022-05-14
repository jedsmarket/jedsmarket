import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        p: 4,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 500,
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
}
