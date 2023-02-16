import { Select } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { DATE_RANGE_INFO_MAP, DateRangeOptions } from '@/pages/NLUManager/pages/UnclassifiedData/constants';
import { DateRangeOption, DateRangeTypes } from '@/pages/NLUManager/pages/UnclassifiedData/types';

const DateRangeSelect: React.FC = () => {
  const nluManager = useNLUManager();

  const handleSelect = (value: DateRangeTypes) => {
    nluManager.setUnclassifiedDataFilters({
      ...nluManager.unclassifiedDataFilters,
      dateRange: value,
    });
  };

  return (
    <Select<DateRangeOption, DateRangeTypes>
      options={DateRangeOptions}
      value={nluManager.unclassifiedDataFilters.dateRange}
      getOptionKey={(option) => option.id}
      getOptionLabel={(optionID) => optionID && DATE_RANGE_INFO_MAP[optionID].label}
      getOptionValue={(option) => option?.id}
      onSelect={handleSelect}
      placeholder="Select date range"
    />
  );
};

export default DateRangeSelect;
