import { useState, useEffect } from 'react';
import type { Instrument } from '../types';
import { INITIAL_INSTRUMENTS, ALL_TIMEFRAMES, generateInitialRSI, generatePriceHistory, generateOHLC } from '../constants';

/*
  useForexData (Alpha Vantage)
  - Replaces mocked data with live OHLC (FX_INTRADAY) from Alpha Vantage
  - Computes RSI for H1 and H4 (approx by aggregating H1 -> H4)
  - Fills other timeframes with initial/mock RSI to avoid breaking UI
  - Staggers requests to respect free-tier rate limits (safe 12s window per 5 requests-ish)
  - Caches results in state and refreshes once per minute by default
*/

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY as string | undefined;
const ALPHA_BASE = 'https://www.alphavantage.co/query';

// Helpers --------------------------------------------------------------
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parsePair(symbol: string) {
  // constants use 'EUR/USD' etc. AlphaVantage expects from_symbol, to_symbol without slash
  const parts = symbol.replace(/\s+/g, '').split('/');
  if (parts.length === 2) return { from: parts[0], to: parts[1] };
  // fallback try to split by non-letters (e.g., EURUSD)
  const s = symbol.replace(/[^A-Z]/gi, '');
  return { from: s.slice(0, 3), to: s.slice(3, 6) };
}

function rsiFromCloses(closes: number[], length = 14) {
  if (closes.length < length + 1) return NaN;
  // calculate initial average gain/loss
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / length;
  let avgLoss = losses / length;
  // Wilder smoothing
  for (let i = length + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (length - 1) + gain) / length;
    avgLoss = (avgLoss * (length - 1) + loss) / length;
  }
  const rs = avgGain / (avgLoss === 0 ? 1e-8 : avgLoss);
  const rsi = 100 - (100 / (1 + rs));
  return rsi;
}

function toSortedClosesFromIntraday(json: any) {
  // Alpha Vantage returns a key like "Time Series FX (60min)" or "Time Series FX (5min)"
  const key = Object.keys(json).find(k => /Time Series/.test(k)) || Object.keys(json).find(k => /FX Intraday/.test(k)) || null;
  const series = key ? json[key] : null;
  if (!series) return [];
  const entries = Object.entries(series).map(([time, obj]: any) => ({
    time,
    close: parseFloat(obj['4. close'] || obj['close'] || obj['4. close']),
  }));
  // sort ascending by time (oldest first)
  entries.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return entries.map(e => e.close);
}

function aggregateToH4(closesH1: number[]) {
  // Aggregate every 4 H1 closes to form one H4 close series (take last close of each 4-block)
  const result: number[] = [];
  for (let i = 3; i < closesH1.length; i += 4) {
    result.push(closesH1[i]);
  }
  return result;
}

// Main hook -----------------------------------------------------------
export const useForexData = (refreshIntervalMs = 60_000) => {
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;

    const fetchForAll = async () => {
      if (!API_KEY) {
        console.warn('VITE_ALPHA_VANTAGE_API_KEY not set. Falling back to mock data.');
        setLoading(false);
        return;
      }

      // We'll iterate through INITIAL_INSTRUMENTS and update them one-by-one with Alpha Vantage data.
      // To be safe versus rate limits we add a small delay between requests.
      const newInstruments = [...INITIAL_INSTRUMENTS];
      const updatedTimestamps: Record<string, number> = {};

      for (let i = 0; i < newInstruments.length; i++) {
        const inst = newInstruments[i];
        try {
          const { from, to } = parsePair(inst.symbol);
          // Use FX_INTRADAY with 60min for H1 basis
          const url = `${ALPHA_BASE}?function=FX_INTRADAY&from_symbol=${encodeURIComponent(from)}&to_symbol=${encodeURIComponent(to)}&interval=60min&outputsize=compact&apikey=${API_KEY}`;
          const res = await fetch(url);
          const json = await res.json();
          const closesH1 = toSortedClosesFromIntraday(json);
          if (closesH1.length > 0) {
            const latestClose = closesH1[closesH1.length - 1];
            // compute H1 RSI
            const rsiH1 = rsiFromCloses(closesH1, 14);
            // compute H4 by aggregating H1 -> H4 (approximation)
            const closesH4 = aggregateToH4(closesH1);
            const rsiH4 = rsiFromCloses(closesH4, 14);

            // Build rsi record: fill H1 and H4, others fallback to initial random values to keep UI stable
            const rsiRecord: any = {};
            ALL_TIMEFRAMES.forEach(tf => {
              if (tf === 'H1') {
                rsiRecord[tf] = { value: Number.isFinite(rsiH1) ? +rsiH1.toFixed(2) : inst.rsi[tf].value, prevValue: inst.rsi[tf].value, delta: (Number.isFinite(rsiH1) ? +rsiH1.toFixed(2) : inst.rsi[tf].value) - inst.rsi[tf].value };
              } else if (tf === 'H4') {
                rsiRecord[tf] = { value: Number.isFinite(rsiH4) ? +rsiH4.toFixed(2) : inst.rsi[tf].value, prevValue: inst.rsi[tf].value, delta: (Number.isFinite(rsiH4) ? +rsiH4.toFixed(2) : inst.rsi[tf].value) - inst.rsi[tf].value };
              } else {
                // fallback: reuse existing/mock value so UI doesn't break
                rsiRecord[tf] = inst.rsi && inst.rsi[tf] ? inst.rsi[tf] : generateInitialRSI()[tf];
              }
            });

            // price history: reuse last 50 H1 closes as history
            const history = closesH1.slice(-50).map((v, idx) => ({ time: `T-${50 - (closesH1.length - (closesH1.length - 50) - idx)}`, value: v }));
            // Build updated instrument
            newInstruments[i] = {
              ...inst,
              price: latestClose,
              open: inst.open,
              high: inst.high,
              low: inst.low,
              close: latestClose,
              atr: inst.atr,
              candle: inst.candle,
              price_change: ((latestClose - inst.close) / (inst.close || latestClose)) * 100,
              spread: inst.spread || 0.0001,
              rsi: rsiRecord,
              priceHistory: history,
              lastUpdateDirection: latestClose > (inst.close || latestClose) ? 'up' : latestClose < (inst.close || latestClose) ? 'down' : 'none'
            };
            updatedTimestamps[newInstruments[i].id] = Date.now();
          } else {
            console.warn(`Alpha Vantage returned no intraday data for ${inst.symbol}`);
          }
        } catch (err) {
          console.error('Error fetching Alpha Vantage for', inst.symbol, err);
        }

        // Sleep between requests to be polite and avoid hitting free-tier limits.
        // Alpha Vantage free tier is rate limited; staggering requests helps avoid 429s.
        await sleep(1200); // 1.2s delay between calls
      }

      if (mounted) {
        setInstruments(newInstruments);
        setLastUpdated(updatedTimestamps);
        setLoading(false);
      }
    };

    // initial fetch immediately then poll every refreshIntervalMs
    fetchForAll();
    const interval = setInterval(fetchForAll, refreshIntervalMs);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [refreshIntervalMs]);

  return { instruments, loading, lastUpdated };
};

export default useForexData;
