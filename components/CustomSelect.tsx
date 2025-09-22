import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative font-sans" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-pointer rounded-md bg-light-bg dark:bg-dark-bg py-2 pl-3 pr-10 text-left border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
      >
        <span className="block truncate">{selectedOption?.label}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>
      
      {isOpen && (
        <div
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-light-card dark:bg-dark-card py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-light-border dark:border-dark-border"
          style={{
            transformOrigin: 'top',
            animation: 'scale-in 0.1s ease-out forwards',
          }}
        >
            <style>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
          {options.map(option => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="relative cursor-pointer select-none py-2 px-4 text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg"
            >
              <span className={`block truncate ${value === option.value ? 'font-medium' : 'font-normal'}`}>
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
