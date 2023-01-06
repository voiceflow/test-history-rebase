import { Select } from '@voiceflow/ui';
import React from 'react';

import { useDiagramGroupedSelectOptions } from '@/hooks';

import { ChildProps, Group, Option } from '../types';
import { useDiagramsIntentsOptionsMap, useOnSelect } from './hooks';

const GroupedSelect: React.OldFC<ChildProps> = ({ onChange, ...props }) => {
  const diagramsIntentsOptions = useDiagramsIntentsOptionsMap();

  const { options, optionsMap } = useDiagramGroupedSelectOptions(diagramsIntentsOptions);

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
