export type Timeframe = 'M1' | 'M2' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1';

export type InstrumentType = 'fx_major' | 'fx_minor' | 'commodity' | 'index';

export interface RsiData {
  value: number;
  prevValue: number;
  delta: number;
}

export interface Instrument {
  id: string;
  symbol: string;
  description: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  atr: number;
  candle: string;
  price_change: number;
  spread: number;
  type: InstrumentType;
  rsi: Record<Timeframe, RsiData>;
  priceHistory: { time: string, value: number }[];
  lastUpdateDirection: 'up' | 'down' | 'none';
}