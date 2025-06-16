// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// import './index.css'; // Keep this commented out or removed if you chose to

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router } from 'react-router-dom'; // <--- Ensure this is imported

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Ensure Router wraps AuthProvider, which then wraps App */}
      <Router> {/* <--- Router starts here */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router> {/* <--- Router ends here */}
    </ThemeProvider>
  </React.StrictMode>,
);