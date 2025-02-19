import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, Paper, Typography } from '@material-ui/core';
import { useTradingContext } from '../store/TradingContext';

const TradingChart = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const { state } = useTradingContext();

  useEffect(() => {
    // Initialize chart
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          backgroundColor: '#1e1e1e',
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            color: 'rgba(42, 46, 57, 0.5)',
          },
        },
        rightPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: 0,
        },
      });

      // Create line series
      seriesRef.current = chartRef.current.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
      });

      // Handle window resize
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, []);

  // Update chart data
  useEffect(() => {
    if (seriesRef.current && state.chartData.length > 0) {
      seriesRef.current.setData(state.chartData);
      
      // Update last price
      const lastData = state.chartData[state.chartData.length - 1];
      if (lastData) {
        seriesRef.current.update(lastData);
      }
    }
  }, [state.chartData]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {state.activeSymbol} Price Chart
      </Typography>
      <Paper 
        ref={chartContainerRef} 
        style={{ 
          height: '400px',
          position: 'relative'
        }}
      >
        {!state.isConnected && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <Typography variant="body1" color="textSecondary">
              Connecting to Deriv API...
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TradingChart;
