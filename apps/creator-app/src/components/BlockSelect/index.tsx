import { FolderScope } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { BaseSelectProps, Menu, MenuItemMultilevel, MenuItemWithID, Select, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React, { useMemo } from 'react';

import { Creator, Designer, Version } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { useSelector } from '@/hooks/redux';
import { createGroupedSelectID, useDomainAndDiagramMultilevelSelectOptions } from '@/hooks/select';

import { useDiagramsBlocksOptionsMap, useOptionsTree } from './hooks';
import { Multilevel, Value } from './types';

export interface BlockSelectProps extends BaseSelectProps {
  value: Value | null;
  onChange: (value: Value | null) => void;
  startNodeIsDefault?: boolean;
}

interface BlockOption extends MenuItemWithID {
  label: string;
  nodeID: string;
  diagramID: string;
}

interface GroupOption extends MenuItemMultilevel<BlockOption | GroupOption> {
  id: string;
  label: string;
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
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const flows = useSelector(Designer.Flow.selectors.all);
  const workflows = useSelector(Designer.Workflow.selectors.all);
  const startNodeID = useSelector(Creator.startNodeIDSelector);
  const rootDiagramID = useSelector(Version.active.rootDiagramIDSelector);

  const diagramsBlocksOptions = useDiagramsBlocksOptionsMap();

  const { options, optionsMap } = useDomainAndDiagramMultilevelSelectOptions(diagramsBlocksOptions, { diagramGroupName: 'Blocks' });

  const [flowOptions, flowOptionMap] = useOptionsTree(flows, { label: 'Components', folderScope: FolderScope.FLOW });
  const [workflowOptions, workflowOptionMap] = useOptionsTree(workflows, { label: 'Workflows', folderScope: FolderScope.WORKFLOW });

  const [optionsV2, optionsMapV2] = useMemo(
    () => [[...workflowOptions, ...flowOptions], { ...flowOptionMap, ...workflowOptionMap }],
    [workflowOptions, flowOptions, flowOptionMap, workflowOptionMap]
  );

  const onSelect = (value: string | null) => {
    const map = cmsWorkflows.isEnabled ? optionsMapV2 : optionsMap;
    const option = value ? map[value] : null;

    if (!option || !('nodeID' in option)) {
      onChange(null);
      return;
    }

    onChange({ stepID: option.nodeID, diagramID: option.diagramID });
  };

  const rootStartValue = startNodeIsDefault && rootDiagramID && startNodeID ? createGroupedSelectID(rootDiagramID, startNodeID) : null;
  const selectValue = value ? createGroupedSelectID(value.diagramID, value.stepID) : rootStartValue || null;

  if (cmsWorkflows.isEnabled) {
    return (
      <Select<GroupOption | UIOnlyMenuItemOption, string>
        {...props}
        value={selectValue}
        options={optionsV2}
        onSelect={onSelect}
        clearable={!!value}
        fullWidth={fullWidth}
        searchable={searchable}
        placeholder={placeholder}
        isMultiLevel
        getOptionKey={(option) => option.id}
        getOptionValue={(option) => option?.id}
        getOptionLabel={(value) => value && optionsMapV2[value]?.label}
        inDropdownSearch={inDropdownSearch}
        alwaysShowCreate={alwaysShowCreate}
        clearOnSelectActive={clearOnSelectActive}
        nestedMenuAutoWidth={nestedMenuAutoWidth}
        createInputPlaceholder={createInputPlaceholder}
        renderEmpty={
          renderEmpty ??
          (({ search }: { search: string }) => (
            <Menu.NotFound>{!search ? 'No blocks exists in your agent. ' : 'No blocks found. '}</Menu.NotFound>
          ))
        }
      />
    );
  }

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
        (({ search }: { search: string }) => <Menu.NotFound>{!search ? 'No blocks exists in your agent. ' : 'No blocks found. '}</Menu.NotFound>)
      }
    />
  );
};

export default BlockSelect;
