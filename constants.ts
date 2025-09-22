import type { Timeframe, Instrument, InstrumentType } from './types';

export const TIMEFRAMES: {id: Timeframe, label: string}[] = [
    { id: 'M1', label: '1 Minute' },
    { id: 'M2', label: '2 Minutes' },
    { id: 'M5', label: '5 Minutes' },
    { id: 'M15', label: '15 Minutes' },
    { id: 'M30', label: '30 Minutes' },
    { id: 'H1', label: '1 Hour' },
    { id: 'H4', label: '4 Hours' },
    { id: 'D1', label: '1 Day' },
];

export const ALL_TIMEFRAMES: Timeframe[] = ['M1', 'M2', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];

export const INSTRUMENT_TYPES: { id: InstrumentType, label: string }[] = [
  { id: 'fx_major', label: 'FX Majors' },
  { id: 'fx_minor', label: 'FX Minors' },
  { id: 'commodity', label: 'Commodities' },
  { id: 'index', label: 'Indices' },
];

export const generatePriceHistory = (base: number) => {
  let history = [];
  let currentPrice = base;
  for (let i = 0; i < 50; i++) {
    history.push({ time: `T-${49-i}`, value: currentPrice });
    currentPrice += (Math.random() - 0.5) * (base * 0.005);
  }
  return history;
};

export const generateInitialRSI = () => {
    const rsiData: any = {};
    ALL_TIMEFRAMES.forEach(tf => {
        const value = 30 + Math.random() * 40;
        rsiData[tf] = {
            value,
            prevValue: value - (Math.random() - 0.5) * 2,
            delta: (Math.random() - 0.5) * 2
        };
    });
    return rsiData;
};

const generateOHLC = (price: number) => {
    const volatility = 0.005;
    const high = price * (1 + Math.random() * volatility);
    const low = price * (1 - Math.random() * volatility);
    const open = low + Math.random() * (high - low);
    return {
        open,
        high,
        low,
        close: price,
        atr: (high - low) * 1.5,
        candle: ['Doji', 'Marubozu', 'Spinning Top'][Math.floor(Math.random()*3)]
    };
};


export const INITIAL_INSTRUMENTS: Instrument[] = [
  { id: 'EURUSD', symbol: 'EUR/USD', description: 'Euro / US Dollar', price: 1.0855, price_change: 0.0012, spread: 0.6, type: 'fx_major', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(1.0855), lastUpdateDirection: 'none', ...generateOHLC(1.0855) },
  { id: 'GBPUSD', symbol: 'GBP/USD', description: 'Great British Pound / US Dollar', price: 1.2710, price_change: -0.0005, spread: 0.9, type: 'fx_major', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(1.2710), lastUpdateDirection: 'none', ...generateOHLC(1.2710) },
  { id: 'USDJPY', symbol: 'USD/JPY', description: 'US Dollar / Japanese Yen', price: 157.25, price_change: 0.15, spread: 0.7, type: 'fx_major', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(157.25), lastUpdateDirection: 'none', ...generateOHLC(157.25) },
  { id: 'AUDUSD', symbol: 'AUD/USD', description: 'Australian Dollar / US Dollar', price: 0.6650, price_change: 0.0008, spread: 0.8, type: 'fx_major', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(0.6650), lastUpdateDirection: 'none', ...generateOHLC(0.6650) },
  { id: 'USDCAD', symbol: 'USD/CAD', description: 'US Dollar / Canadian Dollar', price: 1.3680, price_change: -0.0010, spread: 1.1, type: 'fx_major', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(1.3680), lastUpdateDirection: 'none', ...generateOHLC(1.3680) },
  { id: 'USDCHF', symbol: 'USD/CHF', description: 'US Dollar / Swiss Franc', price: 0.9015, price_change: 0.0025, spread: 1.2, type: 'fx_major', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(0.9015), lastUpdateDirection: 'none', ...generateOHLC(0.9015) },
  { id: 'EURGBP', symbol: 'EUR/GBP', description: 'Euro / Great British Pound', price: 0.8540, price_change: 0.0003, spread: 1.0, type: 'fx_minor', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(0.8540), lastUpdateDirection: 'none', ...generateOHLC(0.8540) },
  { id: 'EURJPY', symbol: 'EUR/JPY', description: 'Euro / Japanese Yen', price: 170.70, price_change: 0.20, spread: 1.3, type: 'fx_minor', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(170.70), lastUpdateDirection: 'none', ...generateOHLC(170.70) },
  { id: 'GBPJPY', symbol: 'GBP/JPY', description: 'Great British Pound / Japanese Yen', price: 199.85, price_change: 0.10, spread: 1.8, type: 'fx_minor', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(199.85), lastUpdateDirection: 'none', ...generateOHLC(199.85) },
  { id: 'AUDJPY', symbol: 'AUD/JPY', description: 'Australian Dollar / Japanese Yen', price: 104.55, price_change: 0.12, spread: 1.5, type: 'fx_minor', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(104.55), lastUpdateDirection: 'none', ...generateOHLC(104.55) },
  { id: 'XAUUSD', symbol: 'XAU/USD', description: 'Gold / US Dollar', price: 2330.50, price_change: -5.20, spread: 2.5, type: 'commodity', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(2330.50), lastUpdateDirection: 'none', ...generateOHLC(2330.50) },
  { id: 'XAGUSD', symbol: 'XAG/USD', description: 'Silver / US Dollar', price: 29.55, price_change: 0.15, spread: 3.0, type: 'commodity', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(29.55), lastUpdateDirection: 'none', ...generateOHLC(29.55) },
  { id: 'USOIL', symbol: 'WTI Crude', description: 'West Texas Intermediate Crude Oil', price: 78.50, price_change: 1.20, spread: 3.5, type: 'commodity', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(78.50), lastUpdateDirection: 'none', ...generateOHLC(78.50) },
  { id: 'SPX500', symbol: 'S&P 500', description: 'Standard & Poor\'s 500 Index', price: 5350.00, price_change: 25.50, spread: 5.0, type: 'index', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(5350.00), lastUpdateDirection: 'none', ...generateOHLC(5350.00) },
  { id: 'NAS100', symbol: 'NASDAQ 100', description: 'NASDAQ 100 Index', price: 19020.00, price_change: 150.75, spread: 8.0, type: 'index', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(19020.00), lastUpdateDirection: 'none', ...generateOHLC(19020.00) },
  { id: 'GER30', symbol: 'DAX 30', description: 'German Stock Index', price: 18550.00, price_change: -50.25, spread: 10.0, type: 'index', rsi: generateInitialRSI(), priceHistory: generatePriceHistory(18550.00), lastUpdateDirection: 'none', ...generateOHLC(18550.00) },
];