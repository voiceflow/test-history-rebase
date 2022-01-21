import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexApart, Select, SelectProps } from '@voiceflow/ui';
import React from 'react';

import { rootNodesSelector } from '@/ducks/creator';
import { useSelector } from '@/hooks';

type BlockOption = Realtime.NodeData<{}>;

type BlockSelectProps = Omit<Partial<SelectProps<BlockOption, string>>, 'onSelect' | 'creatable' | 'onCreate'> & {
  onChange: (value: string) => void;
};

const testBlockOptionRenderer = (option: BlockOption) => <FlexApart fullWidth>{option.name}</FlexApart>;

const BlockSelect: React.FC<BlockSelectProps> = ({ value, onChange, className, ...props }) => {
  const rootNodes = useSelector(rootNodesSelector);
  const selected = value ? rootNodes.find(({ nodeID }) => nodeID === value) : null;

  return (
    <Select
      value={selected?.name || 'Start'}
      options={rootNodes}
      onSelect={(newValue) => onChange(newValue === value ? '' : newValue)}
      searchable
      placeholder="Select a block"
      getOptionValue={(option) => option?.nodeID}
      renderOptionLabel={testBlockOptionRenderer}
      {...props}
    />
  );
};

export default BlockSelect;
