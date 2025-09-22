import React from 'react';
import type { Instrument, Timeframe } from '../types';

interface ScreenerTableProps {
  instruments: Instrument[];
  loading: boolean;
  activeTimeframe: Timeframe;
  onRowClick: (instrument: Instrument) => void;
}

const getStatus = (rsiValue: number) => {
    if (rsiValue > 70) return <span className="text-accent-red font-medium">Overbought</span>;
    if (rsiValue < 30) return <span className="text-accent-green font-medium">Oversold</span>;
    return <span className="text-light-text-secondary dark:text-dark-text-secondary">Neutral</span>;
}

const ScreenerTable: React.FC<ScreenerTableProps> = ({ instruments, loading, activeTimeframe, onRowClick }) => {
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-light-card dark:bg-dark-card rounded-lg mt-4 border border-light-border dark:border-dark-border">
        <p className="text-lg font-display">Loading market data...</p>
      </div>
    );
  }
  
  const getPriceColor = (change: number) => {
      if (change > 0) return 'text-accent-green';
      if (change < 0) return 'text-accent-red';
      return 'text-light-text dark:text-dark-text';
  }

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-light-bg dark:bg-dark-bg text-xs uppercase text-light-text-secondary dark:text-dark-text-secondary font-sans tracking-wider">
            <tr>
              <th scope="col" className="p-4">Symbol</th>
              <th scope="col" className="p-4 text-right">Open</th>
              <th scope="col" className="p-4 text-right">High</th>
              <th scope="col" className="p-4 text-right">Low</th>
              <th scope="col" className="p-4 text-right">Close</th>
              <th scope="col" className="p-4 text-right">RSI ({activeTimeframe})</th>
              <th scope="col" className="p-4 text-right">ATR</th>
              <th scope="col" className="p-4">Candle</th>
              <th scope="col" className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((instrument) => {
                const rsiData = instrument.rsi[activeTimeframe];

              return (
              <tr 
                key={instrument.id} 
                className="group border-b border-light-border dark:border-dark-border hover:bg-light-bg/50 dark:hover:bg-dark-bg/50 transition-colors duration-200 cursor-pointer relative"
                onClick={() => onRowClick(instrument)}
              >
                <td className="p-4">
                  <div className="font-bold text-light-text dark:text-white font-sans">{instrument.symbol}</div>
                  <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{instrument.description}</div>
                </td>
                <td className="p-4 text-right font-mono text-light-text dark:text-dark-text">{instrument.open.toFixed(4)}</td>
                <td className="p-4 text-right font-mono text-light-text dark:text-dark-text">{instrument.high.toFixed(4)}</td>
                <td className="p-4 text-right font-mono text-light-text dark:text-dark-text">{instrument.low.toFixed(4)}</td>
                <td className={`p-4 text-right font-mono ${getPriceColor(instrument.price_change)}`}>{instrument.close.toFixed(4)}</td>
                <td className="p-4 text-right font-mono text-light-text dark:text-dark-text">{rsiData?.value.toFixed(2)}</td>
                <td className="p-4 text-right font-mono text-light-text dark:text-dark-text">{instrument.atr.toFixed(4)}</td>
                <td className="p-4 text-light-text dark:text-dark-text font-sans">{instrument.candle}</td>
                <td className="p-4 font-sans">{getStatus(rsiData.value)}</td>
              </tr>
            )})}
          </tbody>
        </table>
        {instruments.length === 0 && !loading && (
             <div className="text-center py-12 text-light-text-secondary dark:text-dark-text-secondary">
                <p className="font-sans">No instruments match the current filter criteria.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default ScreenerTable;