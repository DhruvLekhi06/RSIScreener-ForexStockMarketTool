import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { useForexData } from './hooks/useForexData';
import type { Instrument, Timeframe } from './types';
import FilterSidebar from './components/FilterSidebar';
import ScreenerTable from './components/ScreenerTable';
import ChartModal from './components/ChartModal';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
};

const Main: React.FC = () => {
  const { instruments, loading } = useForexData();
  const [activeInstrument, setActiveInstrument] = useState<Instrument | null>(null);
  const [isFiltersOpen, setFiltersOpen] = useState(true);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Staged filters, only applied on clicking "Apply"
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    timeframe: 'M5' as Timeframe,
    rsiFilterType: 'above',
    rsiFilterValue: 70
  });
  
  const filteredInstruments = useMemo(() => {
    return instruments.filter(instrument => {
      if (activeFilters.category !== 'all' && instrument.type !== activeFilters.category) {
        return false;
      }
      const rsiData = instrument.rsi[activeFilters.timeframe];
      if (!rsiData) return false;
      const { value: rsiValue, prevValue: rsiPrevValue } = rsiData;
      switch (activeFilters.rsiFilterType) {
        case 'above':
          return rsiValue > activeFilters.rsiFilterValue;
        case 'below':
          return rsiValue < activeFilters.rsiFilterValue;
        case 'crossing_up':
          return rsiPrevValue <= activeFilters.rsiFilterValue && rsiValue > activeFilters.rsiFilterValue;
        case 'crossing_down':
          return rsiPrevValue >= activeFilters.rsiFilterValue && rsiValue < activeFilters.rsiFilterValue;
        default:
          return true;
      }
    });
  }, [instruments, activeFilters]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${e.clientX}px`;
        spotlightRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const openChartModal = (instrument: Instrument) => {
    setActiveInstrument(instrument);
  };

  const closeChartModal = () => {
    setActiveInstrument(null);
  };

  return (
    <>
      <div ref={spotlightRef} className="cursor-spotlight opacity-0"></div>
      <div className="min-h-screen text-light-text dark:text-dark-text font-sans flex">
        <FilterSidebar 
          isOpen={isFiltersOpen}
          setIsOpen={setFiltersOpen}
          onApplyFilters={setActiveFilters}
          initialFilters={activeFilters}
        />
        <main className={`flex-grow transition-all duration-300 ${isFiltersOpen ? 'ml-0 md:ml-72' : 'ml-0'}`}>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-light-text dark:text-white font-display tracking-wide">Forex RSI Screener</h1>
              <div className="flex items-center gap-4">
                 <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary hidden md:block">
                  Last Updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}, {new Date().toLocaleTimeString('en-GB')}
                 </p>
                 <ThemeToggle />
              </div>
            </div>

            <ScreenerTable 
              instruments={filteredInstruments} 
              loading={loading}
              activeTimeframe={activeFilters.timeframe}
              onRowClick={openChartModal}
            />
          </div>
        </main>
        {activeInstrument && (
          <ChartModal 
            instrument={activeInstrument} 
            onClose={closeChartModal} 
          />
        )}
      </div>
    </>
  );
};

export default App;