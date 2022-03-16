import { BaseSelectProps, FlexApart, Select } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';

interface BlockSelectProps extends BaseSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

const BlockSelect: React.FC<BlockSelectProps> = ({ value, onChange, className, ...props }) => {
  const selected = useSelector(CreatorV2.nodeDataByIDSelector, { id: value });
  const allBlockData = useSelector(CreatorV2.allBlocksDataSelector);
  const allBlockMapData = useSelector(CreatorV2.allBlocksMapDataSelector);
  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);

  return (
    <Select
      searchable
      placeholder="Select a block"
      {...props}
      value={selected?.nodeID || startNodeID}
      options={allBlockData}
      onSelect={(newValue) => onChange(newValue === value ? '' : newValue)}
      getOptionKey={(option) => option.nodeID}
      getOptionValue={(option) => option?.nodeID}
      getOptionLabel={(value) => value && allBlockMapData[value]?.name}
      renderOptionLabel={(option) => <FlexApart fullWidth>{option.name}</FlexApart>}
    />
  );
};

export default BlockSelect;
