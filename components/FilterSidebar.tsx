import React, { useState } from 'react';
import { SlidersHorizontal, ChevronsLeft } from 'lucide-react';
import { TIMEFRAMES, INSTRUMENT_TYPES } from '../constants';
import CustomSelect from './CustomSelect';
import type { Timeframe } from '../types';

interface FilterSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onApplyFilters: (filters: any) => void;
  initialFilters: {
    category: string;
    timeframe: Timeframe;
    rsiFilterType: string;
    rsiFilterValue: number;
  }
}

const rsiFilterOptions = [
    { value: 'above', label: 'RSI Above' },
    { value: 'below', label: 'RSI Below' },
    { value: 'crossing_up', label: 'RSI Crossing Up' },
    { value: 'crossing_down', label: 'RSI Crossing Down' },
];

const categoryOptions = [
    { value: 'all', label: 'All Instruments' },
    ...INSTRUMENT_TYPES.map(type => ({ value: type.id, label: type.label })),
];

const timeframeOptions = TIMEFRAMES.map(tf => ({ value: tf.id, label: tf.label }));

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, setIsOpen, onApplyFilters, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleApply = () => {
    onApplyFilters(filters);
  };
  
  const handleReset = () => {
    setFilters(initialFilters);
    onApplyFilters(initialFilters);
  };
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className={`fixed top-0 left-0 h-full bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-72`}>
        <div className="p-4 flex flex-col h-full font-sans">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-light-text dark:text-white flex items-center gap-2 font-display tracking-wide"><SlidersHorizontal size={20}/> Filters</h2>
          </div>

          <div className="space-y-6 flex-grow">
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Category</label>
              <CustomSelect 
                options={categoryOptions}
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Timeframe</label>
              <CustomSelect
                options={timeframeOptions}
                value={filters.timeframe}
                onChange={(value) => handleFilterChange('timeframe', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">RSI Filter</label>
              <CustomSelect
                options={rsiFilterOptions}
                value={filters.rsiFilterType}
                onChange={(value) => handleFilterChange('rsiFilterType', value)}
               />
            </div>

             <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">RSI Value</label>
              <input 
                  type="number"
                  value={filters.rsiFilterValue}
                  onChange={(e) => handleFilterChange('rsiFilterValue', parseInt(e.target.value, 10))}
                  placeholder="e.g., 70"
                  className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md p-2 focus:ring-2 focus:ring-accent-blue focus:outline-none hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-light-border dark:border-dark-border">
            <div className="flex gap-4">
              <button onClick={handleApply} className="flex-1 bg-accent-blue text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-glow-blue">Apply</button>
              <button onClick={handleReset} className="flex-1 bg-light-bg dark:bg-dark-bg text-light-text-secondary dark:text-dark-text-secondary font-semibold py-2 rounded-md hover:bg-light-border dark:hover:bg-dark-border transition-colors">Reset</button>
            </div>
          </div>
        </div>
      </div>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`fixed top-1/2 -translate-y-1/2 z-40 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-r-full p-2 pl-3 transition-all duration-300 ease-in-out hover:bg-light-bg dark:hover:bg-dark-bg
                    ${isOpen ? 'left-72' : 'left-0'}`}
        aria-label="Toggle filters"
      >
        <ChevronsLeft size={20} className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
      </button>
    </>
  );
};

export default FilterSidebar;