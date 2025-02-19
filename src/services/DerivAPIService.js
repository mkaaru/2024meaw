class DerivAPIService {
  static instance = null;
  connection = null;
  balanceSubscription = null;
  priceSubscription = null;
  token = null;

  static getInstance() {
    if (!DerivAPIService.instance) {
      DerivAPIService.instance = new DerivAPIService();
    }
    return DerivAPIService.instance;
  }

  setToken(token) {
    this.token = token;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=68761');

      ws.onopen = () => {
        this.connection = ws;
        
        // If we have a token, authorize immediately
        if (this.token) {
          this.authorize();
        } else {
          // Redirect to Deriv OAuth page
          const encodedRedirectUri = encodeURIComponent('https://8v5m5c-3000.csb.app');
          const oauthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=68761&l=EN&brand=deriv&redirect_uri=${encodedRedirectUri}`;
          window.location.href = oauthUrl;
        }
        
        resolve();
      };

      ws.onerror = (error) => {
        reject(new Error('Connection failed'));
      };

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        
        if (data.error) {
          console.error('API Error:', data.error.message);
          return;
        }

        // Handle different message types
        if (data.msg_type === 'authorize') {
          this.handleAuthorization(data.authorize);
        } else if (data.msg_type === 'balance') {
          this.handleBalanceUpdate(data.balance);
        } else if (data.msg_type === 'tick') {
          this.handlePriceUpdate(data.tick);
        } else if (data.msg_type === 'buy') {
          this.handleTradeResponse(data.buy);
        }
      };
    });
  }

  disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  }

  subscribeToBalance(callback) {
    if (!this.connection) {
      throw new Error('Not connected to API');
    }

    const request = {
      balance: 1,
      subscribe: 1
    };

    this.balanceCallback = callback;
    this.connection.send(JSON.stringify(request));
  }

  subscribeToPriceUpdates(symbol, callback) {
    if (!this.connection) {
      throw new Error('Not connected to API');
    }

    // Unsubscribe from previous symbol if any
    if (this.priceSubscription) {
      this.connection.send(JSON.stringify({
        forget: this.priceSubscription
      }));
    }

    const request = {
      ticks: symbol,
      subscribe: 1
    };

    this.priceCallback = callback;
    this.connection.send(JSON.stringify(request));
  }

  async buyContract(symbol, contractType, amount, duration, durationUnit) {
    if (!this.connection) {
      throw new Error('Not connected to API');
    }

    return new Promise((resolve, reject) => {
      const request = {
        buy: 1,
        price: amount,
        parameters: {
          contract_type: contractType,
          symbol: symbol,
          duration: duration,
          duration_unit: durationUnit,
          basis: 'stake',
          currency: 'USD'
        }
      };

      this.connection.send(JSON.stringify(request));

      // Set up temporary handler for the response
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        
        if (data.error) {
          reject(new Error(data.error.message));
          this.connection.removeEventListener('message', handler);
          return;
        }

        if (data.msg_type === 'buy') {
          resolve(data.buy);
          this.connection.removeEventListener('message', handler);
        }
      };

      this.connection.addEventListener('message', handler);
    });
  }

  handleBalanceUpdate(balance) {
    if (this.balanceCallback) {
      this.balanceCallback(balance);
    }
  }

  handlePriceUpdate(tick) {
    if (this.priceCallback) {
      this.priceCallback({
        time: tick.epoch * 1000, // Convert to milliseconds
        price: tick.quote
      });
    }
  }

  authorize() {
    if (!this.connection || !this.token) {
      throw new Error('Not connected to API or no token available');
    }

    const request = {
      authorize: this.token
    };

    this.connection.send(JSON.stringify(request));
  }

  handleAuthorization(auth) {
    console.log('Successfully authorized:', auth);
    // Dispatch authentication success
    if (this.authCallback) {
      this.authCallback(true);
    }
    // After successful authorization, subscribe to balance
    this.subscribeToBalance();
  }

  setAuthCallback(callback) {
    this.authCallback = callback;
  }

  handleTradeResponse(trade) {
    // Handle trade confirmation
    console.log('Trade executed:', trade);
  }
}

export default DerivAPIService;
