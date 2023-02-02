import { Utils } from '@voiceflow/common';
import React from 'react';

import Select from '../Select';
import COUNTRIES from './countries';
import { filterAndSortOptions } from './utils';

const counteriesMap = Utils.array.createMap(COUNTRIES, ({ value }) => value);

interface CountrySelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, placeholder, error, disabled }) => {
  return (
    <Select
      searchable
      clearable={false}
      error={error}
      disabled={disabled}
      fullWidth
      placeholder={placeholder ?? 'Country'}
      value={value}
      options={COUNTRIES}
      optionsFilter={filterAndSortOptions}
      getOptionKey={({ value }) => value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && counteriesMap[value]?.value}
      onSelect={(value) => onChange(value)}
    />
  );
};

export default CountrySelect;
