import { Select } from '@voiceflow/ui';
import React from 'react';

import { useDomainAndDiagramMultilevelSelectOptions } from '@/hooks/select';

import { ChildProps, Multilevel } from '../types';
import { useDiagramsBlocksOptionsMap, useOnSelect } from './hooks';

const MultilevelSelect: React.FC<ChildProps> = ({ onChange, ...props }) => {
  const diagramsBlocksOptions = useDiagramsBlocksOptionsMap();

  const { options, optionsMap } = useDomainAndDiagramMultilevelSelectOptions(diagramsBlocksOptions, { diagramGroupName: 'Blocks' });

  const onSelect = useOnSelect(onChange, optionsMap);

  return (
    <Select<Multilevel, string>
      {...props}
      options={options}
      onSelect={onSelect}
      isMultiLevel
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      nestedMenuAutoWidth={false}
    />
  );
};

export default MultilevelSelect;
