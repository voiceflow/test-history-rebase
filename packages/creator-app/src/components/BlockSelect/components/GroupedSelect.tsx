import { Select } from '@voiceflow/ui';
import React from 'react';

import { useDiagramGroupedSelectOptions } from '@/hooks/select';

import { ChildProps, Group, Option } from '../types';
import { useDiagramsBlocksOptionsMap, useOnSelect } from './hooks';

const GroupedSelect: React.FC<ChildProps> = ({ onChange, ...props }) => {
  const diagramsBlocksOptions = useDiagramsBlocksOptionsMap();

  const { options, optionsMap } = useDiagramGroupedSelectOptions(diagramsBlocksOptions);

  const onSelect = useOnSelect(onChange, optionsMap);

  return (
    <Select<Option, Group, string>
      {...props}
      grouped
      options={options}
      onSelect={onSelect}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
    />
  );
};

export default GroupedSelect;
