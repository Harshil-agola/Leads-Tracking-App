import { Check, ChevronDown } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  size = 'md',
  className = '',
  containerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select-container ${containerClassName}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        className={`custom-select-trigger select-${size} ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          size={size === 'sm' ? 13 : 15}
          className={`custom-select-chevron ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="custom-select-dropdown" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} className="custom-select-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
