import { Select } from '@voiceflow/ui';
import React from 'react';

import { useDomainAndDiagramMultilevelSelectOptions } from '@/hooks';

import { ChildProps, Multilevel } from '../types';
import { useDiagramsIntentsOptionsMap, useOnSelect } from './hooks';

const MultilevelSelect: React.FC<ChildProps> = ({ onChange, ...props }) => {
  const diagramsIntentsOptions = useDiagramsIntentsOptionsMap();

  const { options, optionsMap } = useDomainAndDiagramMultilevelSelectOptions(diagramsIntentsOptions, { diagramGroupName: 'Intents' });

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
