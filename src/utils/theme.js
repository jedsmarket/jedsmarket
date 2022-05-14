import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#542583',
    },
    secondary: {
      main: '#FDB827',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
