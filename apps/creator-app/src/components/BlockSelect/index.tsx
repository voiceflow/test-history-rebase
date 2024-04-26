import type { Workflow } from '@voiceflow/dtos';
import { FolderScope } from '@voiceflow/dtos';
import { BlockType, FeatureFlag } from '@voiceflow/realtime-sdk';
import type { BaseSelectProps, MenuItemMultilevel, MenuItemWithID, UIOnlyMenuItemOption } from '@voiceflow/ui';
import { createUIOnlyMenuItemOption, Menu, Select } from '@voiceflow/ui';
import React, { useCallback } from 'react';

import { Creator, Designer, Diagram, Version } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { useFolderTree } from '@/hooks/folder.hook';
import { useSelector } from '@/hooks/redux';
import { createGroupedSelectID, useDomainAndDiagramMultilevelSelectOptions } from '@/hooks/select';

import { useDiagramsBlocksOptionsMap } from './hooks';
import type { Multilevel, Value } from './types';

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

  const workflows = useSelector(Designer.Workflow.selectors.all);
  const sharedNodes = useSelector(Diagram.sharedNodesSelector);
  const startNodeID = useSelector(Creator.startNodeIDSelector);
  const rootDiagramID = useSelector(Version.active.rootDiagramIDSelector);

  const diagramsBlocksOptions = useDiagramsBlocksOptionsMap();

  const { options, optionsMap } = useDomainAndDiagramMultilevelSelectOptions(diagramsBlocksOptions, {
    diagramGroupName: 'Blocks',
  });

  const [workflowOptions, workflowOptionMap] = useFolderTree<
    Workflow,
    GroupOption | UIOnlyMenuItemOption,
    GroupOption | BlockOption | UIOnlyMenuItemOption,
    UIOnlyMenuItemOption
  >({
    data: workflows,
    folderScope: FolderScope.WORKFLOW,
    buildFolderTree: useCallback(
      (folder, children): GroupOption => ({ id: folder.id, label: folder.name, options: children }),
      []
    ),
    buildFolderSeparator: useCallback(
      ([{ id }]: GroupOption[]): UIOnlyMenuItemOption =>
        createUIOnlyMenuItemOption(`${id}-header`, { label: 'Folders', groupHeader: true }),
      []
    ),
    buildDataSeparator: useCallback(
      ([{ id }]: GroupOption[]): UIOnlyMenuItemOption =>
        createUIOnlyMenuItemOption(`${id}-header`, { label: 'Workflows', groupHeader: true }),
      []
    ),
    buildDataTree: useCallback(
      (workflow, _, cacheOption): GroupOption => {
        const options = Object.values(sharedNodes?.[workflow.diagramID] ?? {}).reduce<Array<BlockOption | GroupOption>>(
          (acc, sharedNode) => {
            if (!sharedNode || (sharedNode.type !== BlockType.COMBINED && sharedNode.type !== BlockType.START))
              return acc;
            if (sharedNode.type !== BlockType.START && !sharedNode.name) return acc;

            return [
              ...acc,
              cacheOption({
                id: createGroupedSelectID(workflow.diagramID, sharedNode.nodeID),
                label: sharedNode.type === BlockType.START ? sharedNode.name || 'Start' : sharedNode.name,
                nodeID: sharedNode.nodeID,
                diagramID: workflow.diagramID,
              }),
            ];
          },
          []
        );

        return {
          id: workflow.id,
          label: workflow.name,
          options: [
            cacheOption(
              createUIOnlyMenuItemOption(`${workflow.id}-blocks-header`, { label: 'Blocks', groupHeader: true })
            ),
            ...(!options.length
              ? [
                  cacheOption(
                    createUIOnlyMenuItemOption(`${workflow.id}-no-blocks`, {
                      label: 'No blocks',
                      isEmpty: true,
                      disabled: true,
                    })
                  ),
                ]
              : options),
          ],
        };
      },
      [sharedNodes]
    ),
  });

  const onSelect = (value: string | null) => {
    const map = cmsWorkflows.isEnabled ? workflowOptionMap : optionsMap;
    const option = value ? map[value] : null;

    if (!option || !('nodeID' in option)) {
      onChange(null);
      return;
    }

    onChange({ stepID: option.nodeID, diagramID: option.diagramID });
  };

  const rootStartValue =
    startNodeIsDefault && rootDiagramID && startNodeID ? createGroupedSelectID(rootDiagramID, startNodeID) : null;
  const selectValue = value ? createGroupedSelectID(value.diagramID, value.stepID) : rootStartValue || null;

  if (cmsWorkflows.isEnabled) {
    return (
      <Select<GroupOption | UIOnlyMenuItemOption, string>
        {...props}
        value={selectValue}
        options={workflowOptions}
        onSelect={onSelect}
        clearable={!!value}
        fullWidth={fullWidth}
        searchable={searchable}
        placeholder={placeholder}
        isMultiLevel
        getOptionKey={(option) => option.id}
        getOptionValue={(option) => option?.id}
        getOptionLabel={(value) => value && workflowOptionMap[value]?.label}
        inDropdownSearch={inDropdownSearch}
        alwaysShowCreate={alwaysShowCreate}
        clearOnSelectActive={clearOnSelectActive}
        nestedMenuAutoWidth={nestedMenuAutoWidth}
        createInputPlaceholder={createInputPlaceholder}
        renderEmpty={
          renderEmpty ??
          (({ search }: { search: string }) => (
            <Menu.NotFound>{!search ? 'No blocks exists in your assistant. ' : 'No blocks found. '}</Menu.NotFound>
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
        (({ search }: { search: string }) => (
          <Menu.NotFound>{!search ? 'No blocks exists in your assistant. ' : 'No blocks found. '}</Menu.NotFound>
        ))
      }
    />
  );
};

export default BlockSelect;
