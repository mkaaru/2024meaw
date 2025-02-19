import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  makeStyles,
  Paper,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
} from '@material-ui/core';
import { useTradingContext } from '../store/TradingContext';
import strategies from '../services/TradingStrategies';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  strategyInfo: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
  parameterControl: {
    marginTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

const StrategySelector = () => {
  const classes = useStyles();
  const { state, dispatch } = useTradingContext();

  const handleStrategyChange = (event) => {
    dispatch({ type: 'SET_STRATEGY', payload: event.target.value });
  };

  const getStrategyParameters = () => {
    switch (state.selectedStrategy) {
      case 'sma':
        return (
          <Box className={classes.parameterControl}>
            <Typography gutterBottom>SMA Period</Typography>
            <Slider
              value={14}
              min={5}
              max={50}
              step={1}
              marks={[
                { value: 5, label: '5' },
                { value: 14, label: '14' },
                { value: 50, label: '50' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        );
      case 'rsi':
        return (
          <>
            <Box className={classes.parameterControl}>
              <Typography gutterBottom>RSI Period</Typography>
              <Slider
                value={14}
                min={7}
                max={21}
                step={1}
                marks={[
                  { value: 7, label: '7' },
                  { value: 14, label: '14' },
                  { value: 21, label: '21' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box className={classes.parameterControl}>
              <Typography gutterBottom>Overbought/Oversold Levels</Typography>
              <Slider
                value={[30, 70]}
                min={0}
                max={100}
                step={1}
                marks={[
                  { value: 30, label: '30' },
                  { value: 70, label: '70' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
          </>
        );
      case 'macd':
        return (
          <>
            <Box className={classes.parameterControl}>
              <Typography gutterBottom>Fast Period</Typography>
              <Slider
                value={12}
                min={8}
                max={20}
                step={1}
                marks={[
                  { value: 8, label: '8' },
                  { value: 12, label: '12' },
                  { value: 20, label: '20' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box className={classes.parameterControl}>
              <Typography gutterBottom>Slow Period</Typography>
              <Slider
                value={26}
                min={20}
                max={40}
                step={1}
                marks={[
                  { value: 20, label: '20' },
                  { value: 26, label: '26' },
                  { value: 40, label: '40' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Trading Strategy
      </Typography>

      <FormControl className={classes.formControl}>
        <InputLabel>Strategy</InputLabel>
        <Select value={state.selectedStrategy} onChange={handleStrategyChange}>
          {Object.entries(strategies).map(([key, strategy]) => (
            <MenuItem key={key} value={key}>
              {strategy.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider className={classes.divider} />

      <Box className={classes.strategyInfo}>
        <Typography variant="subtitle2" gutterBottom>
          Strategy Description
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {strategies[state.selectedStrategy].description}
        </Typography>
      </Box>

      {state.selectedStrategy !== 'manual' && (
        <>
          <Divider className={classes.divider} />
          
          <FormControlLabel
            control={
              <Switch
                checked={state.isAutoTrading}
                onChange={(e) => dispatch({ 
                  type: 'SET_AUTO_TRADING', 
                  payload: e.target.checked 
                })}
                color="primary"
              />
            }
            label="Auto Trading"
          />

          {getStrategyParameters()}
        </>
      )}
    </Paper>
  );
};

export default StrategySelector;
