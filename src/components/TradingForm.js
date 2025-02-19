import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useTradingContext } from '../store/TradingContext';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
  },
  balanceInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
}));

const SYMBOLS = [
  { value: 'R_100', label: 'Volatility 100 Index' },
  { value: 'R_75',  label: 'Volatility 75 Index' },
  { value: 'R_50',  label: 'Volatility 50 Index' },
  { value: 'R_25',  label: 'Volatility 25 Index' },
];

const TRADE_TYPES = [
  { value: 'CALL', label: 'Rise' },
  { value: 'PUT',  label: 'Fall' },
];

const DURATION_UNITS = [
  { value: 't', label: 'Ticks' },
  { value: 's', label: 'Seconds' },
  { value: 'm', label: 'Minutes' },
  { value: 'h', label: 'Hours' },
];

const TradingForm = () => {
  const classes = useStyles();
  const { state, dispatch, placeTrade } = useTradingContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    placeTrade();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Trade Parameters
      </Typography>

      <div className={classes.balanceInfo}>
        <Typography variant="subtitle1">Balance:</Typography>
        <Typography variant="h6">
          ${state.balance ? state.balance.toFixed(2) : '0.00'}
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className={classes.form}>
        <FormControl className={classes.formControl}>
          <InputLabel>Symbol</InputLabel>
          <Select
            value={state.activeSymbol}
            onChange={(e) => dispatch({ type: 'SET_SYMBOL', payload: e.target.value })}
          >
            {SYMBOLS.map((symbol) => (
              <MenuItem key={symbol.value} value={symbol.value}>
                {symbol.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel>Trade Type</InputLabel>
          <Select
            value={state.tradeType}
            onChange={(e) => dispatch({ type: 'SET_TRADE_TYPE', payload: e.target.value })}
          >
            {TRADE_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Stake Amount"
          type="number"
          value={state.amount}
          onChange={(e) => dispatch({ type: 'SET_AMOUNT', payload: Number(e.target.value) })}
          InputProps={{
            inputProps: { min: 1 }
          }}
        />

        <Box display="flex" gap={2}>
          <TextField
            label="Duration"
            type="number"
            value={state.duration}
            onChange={(e) => dispatch({ type: 'SET_DURATION', payload: Number(e.target.value) })}
            InputProps={{
              inputProps: { min: 1 }
            }}
            style={{ flex: 1 }}
          />

          <FormControl style={{ flex: 1 }}>
            <InputLabel>Unit</InputLabel>
            <Select
              value={state.durationUnit}
              onChange={(e) => dispatch({ type: 'SET_DURATION_UNIT', payload: e.target.value })}
            >
              {DURATION_UNITS.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!state.isConnected || state.isTrading}
          fullWidth
        >
          {state.isTrading ? 'Placing Trade...' : 'Place Trade'}
        </Button>

        {state.error && (
          <Typography color="error" variant="body2">
            {state.error}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default TradingForm;
