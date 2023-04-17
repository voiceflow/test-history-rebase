import { Utils } from '@voiceflow/common';
import React from 'react';

import Select from '../Select';
import COUNTRIES from './countries';
import { filterAndSortOptions } from './utils';

interface CountrySelectProps {
  value: string | null;
  error?: boolean;
  onClose?: VoidFunction;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, error, onClose, onChange, disabled, placeholder }) => {
  const countriesMap = React.useMemo(() => Utils.array.createMap(COUNTRIES, ({ value }) => value ?? ''), []);

  return (
    <Select
      error={error}
      value={value}
      options={COUNTRIES}
      disabled={disabled}
      onSelect={(value) => onChange(value)}
      clearable={false}
      fullWidth
      onClose={onClose}
      searchable
      placeholder={placeholder ?? 'Country'}
      getOptionKey={({ value }) => value}
      optionsFilter={filterAndSortOptions}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && countriesMap[value]?.value}
    />
  );
};

export default CountrySelect;
