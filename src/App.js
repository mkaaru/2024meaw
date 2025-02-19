import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Container, Grid, Paper } from '@material-ui/core';
import { TradingProvider } from './store/TradingContext';
import TradingChart from './components/TradingChart';
import TradingForm from './components/TradingForm';
import StrategySelector from './components/StrategySelector';
import TradingHistory from './components/TradingHistory';
import theme from './theme';
import DerivAPIService from './services/DerivAPIService';

function App() {
  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token1');
    
    if (token) {
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Set the token in the API service
      const api = DerivAPIService.getInstance();
      api.setToken(token);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TradingProvider>
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper style={{ padding: '1rem' }}>
                <TradingChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper style={{ padding: '1rem' }}>
                    <TradingForm />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper style={{ padding: '1rem' }}>
                    <StrategySelector />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Paper style={{ padding: '1rem' }}>
                <TradingHistory />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </TradingProvider>
    </ThemeProvider>
  );
}

export default App;
