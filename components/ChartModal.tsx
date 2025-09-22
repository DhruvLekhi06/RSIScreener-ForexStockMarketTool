import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import type { Instrument } from '../types';
import { useTheme } from '../hooks/useTheme';

interface ChartModalProps {
  instrument: Instrument;
  onClose: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-light-card dark:bg-dark-card p-2 border border-light-border dark:border-dark-border rounded shadow-lg text-xs font-sans">
          <p className="label text-light-text-secondary dark:text-dark-text-secondary">{`Time: ${label}`}</p>
          <p className="text-light-text dark:text-white font-mono">{`Price: ${payload[0].value.toFixed(4)}`}</p>
        </div>
      );
    }
    return null;
  };

  const RsiTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-light-card dark:bg-dark-card p-2 border border-light-border dark:border-dark-border rounded shadow-lg text-xs font-sans">
          <p className="label text-light-text-secondary dark:text-dark-text-secondary">{`Time: ${label}`}</p>
          <p className="text-accent-yellow font-mono">{`RSI: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

const ChartModal: React.FC<ChartModalProps> = ({ instrument, onClose }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const rsiHistory = instrument.priceHistory.map((_, i) => ({
      time: `T-${49-i}`,
      value: 30 + (Math.sin(i / 5) * 20) + Math.random() * 10, // Simulated RSI data
  }));

  const gridColor = theme === 'dark' ? 'rgba(245, 245, 245, 0.1)' : 'rgba(23, 23, 23, 0.1)';
  const textColor = theme === 'dark' ? '#a3a3a3' : '#525252';

  return (
    <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-light-card dark:bg-dark-card w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl flex flex-col border border-light-border dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border">
          <div>
            <h2 className="text-2xl font-bold text-light-text dark:text-white font-display">{instrument.symbol}</h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-sans">{instrument.description}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Chart Area */}
        <div className="flex-grow p-4 overflow-y-auto">
            <div className="h-2/3 mb-4">
                <h3 className="text-sm font-semibold mb-2 text-light-text-secondary dark:text-dark-text-secondary font-sans tracking-wider uppercase">Price Chart</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={instrument.priceHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="time" tick={{fontSize: 10, fill: textColor}}/>
                        <YAxis tick={{fontSize: 10, fill: textColor}} domain={['dataMin', 'dataMax']} orientation="right"/>
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="value" name="Price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="h-1/3">
                 <h3 className="text-sm font-semibold mb-2 text-light-text-secondary dark:text-dark-text-secondary font-sans tracking-wider uppercase">RSI (14)</h3>
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rsiHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
                        <XAxis dataKey="time" tick={{fontSize: 10, fill: textColor}}/>
                        <YAxis tick={{fontSize: 10, fill: textColor}} domain={[0, 100]} orientation="right" ticks={[20, 30, 50, 70, 80]}/>
                        <Tooltip content={<RsiTooltip />} />
                        <Line type="monotone" dataKey="value" name="RSI" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        <Line y={70} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} isAnimationActive={false} dot={false}/>
                        <Line y={30} stroke="#10b981" strokeDasharray="5 5" strokeWidth={1} isAnimationActive={false} dot={false}/>
                    </LineChart>
                 </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChartModal;