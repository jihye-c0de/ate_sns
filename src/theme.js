import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3a332c',
      contrastText: '#faf7f2',
    },
    secondary: {
      main: '#b08a5f',
      contrastText: '#faf7f2',
    },
    background: {
      default: '#faf6ef',
      paper: '#fffdf9',
    },
    text: {
      primary: '#3a332c',
      secondary: '#7a7267',
    },
    divider: '#e8e0d4',
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  spacing: 8,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
