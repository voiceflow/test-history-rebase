import { BaseSelectProps, Menu, Select } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks/redux';
import { createGroupedSelectID, useDomainAndDiagramMultilevelSelectOptions } from '@/hooks/select';

import { useDiagramsBlocksOptionsMap } from './hooks';
import { Multilevel, Value } from './types';

export interface BlockSelectProps extends BaseSelectProps {
  value: Value | null;
  onChange: (value: Value | null) => void;
  startNodeIsDefault?: boolean;
}

const BlockSelect: React.FC<BlockSelectProps> = ({
  value,
  onChange,
  fullWidth = true,
  searchable = true,
  placeholder = 'Select a block',
  renderEmpty,
  inDropdownSearch = true,
  alwaysShowCreate = true,
  startNodeIsDefault,
  clearOnSelectActive = true,
  nestedMenuAutoWidth = false,
  createInputPlaceholder = 'blocks',
  ...props
}) => {
  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);
  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);

  const diagramsBlocksOptions = useDiagramsBlocksOptionsMap();

  const { options, optionsMap } = useDomainAndDiagramMultilevelSelectOptions(diagramsBlocksOptions, { diagramGroupName: 'Blocks' });

  const onSelect = (value: string | null) => {
    const option = value ? optionsMap[value] : null;

    if (!option || !('stepID' in option)) {
      onChange(null);
      return;
    }

    onChange({ stepID: option.stepID, diagramID: option.diagramID });
  };

  const rootStartValue = startNodeIsDefault && rootDiagramID && startNodeID ? createGroupedSelectID(rootDiagramID, startNodeID) : null;
  const selectValue = value ? createGroupedSelectID(value.diagramID, value.stepID) : rootStartValue || null;

  return (
    <Select<Multilevel, string>
      {...props}
      value={selectValue}
      options={options}
      onSelect={onSelect}
      clearable={!!value}
      fullWidth={fullWidth}
      searchable={searchable}
      placeholder={placeholder}
      isMultiLevel
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      inDropdownSearch={inDropdownSearch}
      alwaysShowCreate={alwaysShowCreate}
      clearOnSelectActive={clearOnSelectActive}
      nestedMenuAutoWidth={nestedMenuAutoWidth}
      createInputPlaceholder={createInputPlaceholder}
      renderEmpty={
        renderEmpty ??
        (({ search }: { search: string }) => <Menu.NotFound>{!search ? 'No blocks exists in your assistant. ' : 'No blocks found. '}</Menu.NotFound>)
      }
    />
  );
};

export default BlockSelect;
