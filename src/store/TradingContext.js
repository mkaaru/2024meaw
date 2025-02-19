import React, { createContext, useContext, useReducer, useEffect } from 'react';
import DerivAPIService from '../services/DerivAPIService';

const TradingContext = createContext();

const initialState = {
  isConnected: false,
  isAuthenticated: false,
  balance: null,
  activeSymbol: 'R_100',
  tradeType: 'CALL',
  amount: 10,
  duration: 1,
  durationUnit: 'm',
  selectedStrategy: 'manual',
  trades: [],
  chartData: [],
  isTrading: false,
  error: null,
};

function tradingReducer(state, action) {
  switch (action.type) {
    case 'SET_CONNECTION':
      return { ...state, isConnected: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_SYMBOL':
      return { ...state, activeSymbol: action.payload };
    case 'SET_TRADE_TYPE':
      return { ...state, tradeType: action.payload };
    case 'SET_AMOUNT':
      return { ...state, amount: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_DURATION_UNIT':
      return { ...state, durationUnit: action.payload };
    case 'SET_STRATEGY':
      return { ...state, selectedStrategy: action.payload };
    case 'ADD_TRADE':
      return { ...state, trades: [action.payload, ...state.trades] };
    case 'UPDATE_CHART_DATA':
      return { ...state, chartData: action.payload };
    case 'SET_TRADING':
      return { ...state, isTrading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function TradingProvider({ children }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState);
  const api = DerivAPIService.getInstance();

  useEffect(() => {
    const connectToAPI = async () => {
      try {
        // Set up authentication callback before connecting
        api.setAuthCallback((isAuthenticated) => {
          dispatch({ type: 'SET_AUTHENTICATED', payload: isAuthenticated });
        });

        await api.connect();
        dispatch({ type: 'SET_CONNECTION', payload: true });
        
        // Subscribe to balance updates
        api.subscribeToBalance((balance) => {
          dispatch({ type: 'SET_BALANCE', payload: balance });
        });

        // Subscribe to price updates for the active symbol
        api.subscribeToPriceUpdates(state.activeSymbol, (data) => {
          dispatch({ type: 'UPDATE_CHART_DATA', payload: data });
        });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    connectToAPI();

    return () => {
      api.disconnect();
    };
  }, [api, state.activeSymbol, dispatch]);

  const placeTrade = async () => {
    if (!state.isConnected) {
      dispatch({ type: 'SET_ERROR', payload: 'Not connected to Deriv API' });
      return;
    }

    try {
      dispatch({ type: 'SET_TRADING', payload: true });
      const result = await api.buyContract(
        state.activeSymbol,
        state.tradeType,
        state.amount,
        state.duration,
        state.durationUnit
      );
      dispatch({ type: 'ADD_TRADE', payload: result });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_TRADING', payload: false });
    }
  };

  const value = {
    state,
    dispatch,
    placeTrade,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTradingContext() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
}
