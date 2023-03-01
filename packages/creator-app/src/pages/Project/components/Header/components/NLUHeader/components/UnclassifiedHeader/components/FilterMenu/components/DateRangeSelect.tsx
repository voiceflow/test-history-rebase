import { Select } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { DATE_RANGE_INFO_MAP, DateRangeOptions } from '@/pages/NLUManager/pages/UnclassifiedData/constants';
import { DateRangeOption, DateRangeTypes } from '@/pages/NLUManager/pages/UnclassifiedData/types';

import type { FilterMenuSectionComponentProps } from './types';

const DateRangeSelect: React.FC<FilterMenuSectionComponentProps> = ({ isActive }) => {
  const nluManager = useNLUManager();

  const handleSelect = (value: DateRangeTypes) => {
    nluManager.setUnclassifiedDataFilters({
      ...nluManager.unclassifiedDataFilters,
      dateRange: value,
    });
  };

  if (!isActive) return null;

  return (
    <Select<DateRangeOption, DateRangeTypes>
      value={nluManager.unclassifiedDataFilters.dateRange}
      options={DateRangeOptions}
      onSelect={handleSelect}
      placeholder="Select date range"
      getOptionKey={(option) => option.id}
      getOptionLabel={(optionID) => optionID && DATE_RANGE_INFO_MAP[optionID].label}
      getOptionValue={(option) => option?.id}
    />
  );
};

export default DateRangeSelect;
