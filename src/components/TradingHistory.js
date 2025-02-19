import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  Chip,
} from '@material-ui/core';
import { 
  TrendingUp as ProfitIcon,
  TrendingDown as LossIcon,
} from '@material-ui/icons';
import { useTradingContext } from '../store/TradingContext';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: 400,
    marginTop: theme.spacing(2),
  },
  profitChip: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  lossChip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  typeChip: {
    margin: theme.spacing(0, 1),
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.background.default,
  },
  noTradesMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
}));

const TradingHistory = () => {
  const classes = useStyles();
  const { state } = useTradingContext();

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (duration, unit) => {
    const units = {
      't': 'ticks',
      's': 'seconds',
      'm': 'minutes',
      'h': 'hours',
    };
    return `${duration} ${units[unit]}`;
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Trading History
      </Typography>

      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerCell}>Time</TableCell>
              <TableCell className={classes.headerCell}>Symbol</TableCell>
              <TableCell className={classes.headerCell}>Type</TableCell>
              <TableCell className={classes.headerCell}>Duration</TableCell>
              <TableCell className={classes.headerCell}>Stake</TableCell>
              <TableCell className={classes.headerCell}>Result</TableCell>
              <TableCell className={classes.headerCell}>Strategy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.trades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.noTradesMessage}>
                    No trades yet. Start trading to see your history here.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              state.trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{formatDateTime(trade.timestamp)}</TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>
                    <Chip
                      label={trade.type}
                      size="small"
                      className={classes.typeChip}
                      color={trade.type === 'CALL' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    {formatDuration(trade.duration, trade.durationUnit)}
                  </TableCell>
                  <TableCell>${trade.stake.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      icon={trade.profit >= 0 ? <ProfitIcon /> : <LossIcon />}
                      label={`${trade.profit >= 0 ? '+' : ''}$${trade.profit.toFixed(2)}`}
                      className={trade.profit >= 0 ? classes.profitChip : classes.lossChip}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={trade.strategy}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {state.trades.length > 0 && (
        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography variant="subtitle2">
            Total Trades: {state.trades.length}
          </Typography>
          <Typography variant="subtitle2">
            Net Profit: 
            <Chip
              label={`$${state.trades.reduce((sum, trade) => sum + trade.profit, 0).toFixed(2)}`}
              size="small"
              className={
                state.trades.reduce((sum, trade) => sum + trade.profit, 0) >= 0
                  ? classes.profitChip
                  : classes.lossChip
              }
              style={{ marginLeft: 8 }}
            />
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TradingHistory;
