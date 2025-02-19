export class TradingStrategy {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  analyze(data) {
    throw new Error('analyze method must be implemented by strategy');
  }
}

export class ManualStrategy extends TradingStrategy {
  constructor() {
    super(
      'manual',
      'Manual trading - you decide when to enter trades'
    );
  }

  analyze() {
    // Manual strategy doesn't provide signals
    return null;
  }
}

export class SimpleMovingAverageStrategy extends TradingStrategy {
  constructor(period = 14) {
    super(
      'sma',
      'Simple Moving Average (SMA) strategy'
    );
    this.period = period;
  }

  analyze(data) {
    if (data.length < this.period + 1) {
      return null;
    }

    // Calculate SMA
    const sma = this.calculateSMA(data.slice(-this.period - 1, -1));
    const currentPrice = data[data.length - 1].price;

    // Generate signal based on price crossing SMA
    if (currentPrice > sma && data[data.length - 2].price <= sma) {
      return { type: 'CALL', confidence: 0.6 };
    } else if (currentPrice < sma && data[data.length - 2].price >= sma) {
      return { type: 'PUT', confidence: 0.6 };
    }

    return null;
  }

  calculateSMA(data) {
    const sum = data.reduce((acc, candle) => acc + candle.price, 0);
    return sum / data.length;
  }
}

export class RSIStrategy extends TradingStrategy {
  constructor(period = 14, overbought = 70, oversold = 30) {
    super(
      'rsi',
      'Relative Strength Index (RSI) strategy'
    );
    this.period = period;
    this.overbought = overbought;
    this.oversold = oversold;
  }

  analyze(data) {
    if (data.length < this.period + 1) {
      return null;
    }

    const rsi = this.calculateRSI(data.slice(-this.period - 1));

    if (rsi <= this.oversold) {
      return { type: 'CALL', confidence: 0.7 };
    } else if (rsi >= this.overbought) {
      return { type: 'PUT', confidence: 0.7 };
    }

    return null;
  }

  calculateRSI(data) {
    let gains = 0;
    let losses = 0;

    // Calculate price changes and separate into gains and losses
    for (let i = 1; i < data.length; i++) {
      const change = data[i].price - data[i - 1].price;
      if (change >= 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    // Calculate average gains and losses
    const avgGain = gains / this.period;
    const avgLoss = losses / this.period;

    // Calculate RS and RSI
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
  }
}

export class MACDStrategy extends TradingStrategy {
  constructor(fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    super(
      'macd',
      'Moving Average Convergence Divergence (MACD) strategy'
    );
    this.fastPeriod = fastPeriod;
    this.slowPeriod = slowPeriod;
    this.signalPeriod = signalPeriod;
  }

  analyze(data) {
    if (data.length < this.slowPeriod + this.signalPeriod) {
      return null;
    }

    const { macdLine, signalLine } = this.calculateMACD(data);

    // Generate signals based on MACD line crossing signal line
    if (macdLine > signalLine && macdLine > 0) {
      return { type: 'CALL', confidence: 0.65 };
    } else if (macdLine < signalLine && macdLine < 0) {
      return { type: 'PUT', confidence: 0.65 };
    }

    return null;
  }

  calculateEMA(data, period) {
    const k = 2 / (period + 1);
    let ema = data[0].price;

    for (let i = 1; i < data.length; i++) {
      ema = data[i].price * k + ema * (1 - k);
    }

    return ema;
  }

  calculateMACD(data) {
    const fastEMA = this.calculateEMA(data.slice(-this.fastPeriod), this.fastPeriod);
    const slowEMA = this.calculateEMA(data.slice(-this.slowPeriod), this.slowPeriod);
    const macdLine = fastEMA - slowEMA;
    const signalLine = this.calculateEMA(
      data.slice(-this.signalPeriod).map(d => ({ price: macdLine })),
      this.signalPeriod
    );

    return { macdLine, signalLine };
  }
}

const strategies = {
  manual: new ManualStrategy(),
  sma: new SimpleMovingAverageStrategy(),
  rsi: new RSIStrategy(),
  macd: new MACDStrategy(),
};

export default strategies;
