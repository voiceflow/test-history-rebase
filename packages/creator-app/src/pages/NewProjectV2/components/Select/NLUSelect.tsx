import { Select } from '@voiceflow/ui';
import React from 'react';

import { getNLUMeta, NLU_SECTIONS, NLUType } from '../../constants';

interface NLUSelectProps {
  value?: NLUType;
  onSelect: (value: NLUType) => void;
}

const NLUSelect: React.FC<NLUSelectProps> = ({ value, onSelect }) => {
  return (
    <Select
      grouped
      getOptionValue={(option) => option?.type as any}
      getOptionLabel={(option) => (option ? getNLUMeta[option]?.name : '')}
      value={value}
      options={NLU_SECTIONS as any[]}
      onSelect={onSelect}
      placeholder="Select NLU"
    ></Select>
  );
};

export default NLUSelect;
