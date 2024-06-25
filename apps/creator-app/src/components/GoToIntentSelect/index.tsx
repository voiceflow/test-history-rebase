import type { Workflow } from '@voiceflow/dtos';
import { FolderScope } from '@voiceflow/dtos';
import { BlockType, FeatureFlag } from '@voiceflow/realtime-sdk';
import type { BaseSelectProps, MenuItemMultilevel, MenuItemWithID, UIOnlyMenuItemOption } from '@voiceflow/ui';
import { createUIOnlyMenuItemOption, Link, Menu, Select } from '@voiceflow/ui';
import React, { useCallback } from 'react';

import * as Documentation from '@/config/documentation';
import { Designer, Diagram } from '@/ducks';
import { useFeature } from '@/hooks/feature.hook';
import { useFolderTree } from '@/hooks/folder.hook';
import { useSelector } from '@/hooks/store.hook';

import type { Value } from './types';
import { createCombinedID } from './utils';

export interface GoToIntentSelectProps extends BaseSelectProps {
  value: Value | null;
  onChange: (value: Value | null) => void;
}

interface IntentOption extends MenuItemWithID {
  label: string;
  nodeID: string;
  intentID: string;
  diagramID: string;
}

interface GroupOption extends MenuItemMultilevel<IntentOption | GroupOption> {
  id: string;
  label: string;
}

const GoToIntentSelect: React.FC<GoToIntentSelectProps> = ({
  value,
  onChange,
  fullWidth = true,
  searchable = true,
  renderEmpty,
  placeholder = 'Behave as user triggered intent',
  inDropdownSearch = true,
  alwaysShowCreate = true,
  clearOnSelectActive = true,
  nestedMenuAutoWidth = false,
  createInputPlaceholder = 'intents',
  ...props
}) => {
  const referenceSystem = useFeature(FeatureFlag.REFERENCE_SYSTEM);

  const workflows = useSelector(Designer.Workflow.selectors.all);
  const getIntentByID = useSelector(Designer.Intent.selectors.getOneWithFormattedBuiltNameByID);
  const globalIntentStepMap = useSelector(Diagram.globalIntentStepMapSelector);
  const triggersMapByDiagramID = useSelector(Designer.Reference.selectors.triggersMapByDiagramID);
  const globalTriggerNodeIDsByIntentIDMapByDiagramIDMap = useSelector(
    Designer.Reference.selectors.globalTriggerNodeIDsByIntentIDMapByDiagramIDMap
  );

  const [workflowOptions, workflowOptionMap] = useFolderTree<
    Workflow,
    GroupOption | UIOnlyMenuItemOption,
    GroupOption | IntentOption | UIOnlyMenuItemOption,
    UIOnlyMenuItemOption
  >({
    data: workflows,
    dataSorter: (a, b) => a.label.localeCompare(b.label),
    folderScope: FolderScope.WORKFLOW,
    folderSorter: (a, b) => a.label.localeCompare(b.label),
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
        const options = (triggersMapByDiagramID[workflow.diagramID] ?? []).reduce<Array<IntentOption | GroupOption>>(
          (acc, triggerNode) => {
            if (
              triggerNode.type !== BlockType.INTENT &&
              triggerNode.type !== BlockType.TRIGGER &&
              triggerNode.type !== BlockType.START
            )
              return acc;

            const intent = getIntentByID({ id: triggerNode.intentID });
            const globalIntentNodeIDsByIntentID = referenceSystem
              ? globalTriggerNodeIDsByIntentIDMapByDiagramIDMap[workflow.diagramID]
              : globalIntentStepMap[workflow.diagramID];

            if (!intent || !globalIntentNodeIDsByIntentID?.[intent.id]?.length) return acc;

            return [
              ...acc,
              cacheOption({
                id: createCombinedID(workflow.diagramID, intent.id),
                label: intent.name,
                nodeID: triggerNode.nodeID,
                intentID: intent.id,
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
              createUIOnlyMenuItemOption(`${workflow.id}-intents-header`, { label: 'Intents', groupHeader: true })
            ),
            ...(!options.length
              ? [
                  cacheOption(
                    createUIOnlyMenuItemOption(`${workflow.id}-no-intents`, {
                      label: 'No intents',
                      isEmpty: true,
                      disabled: true,
                    })
                  ),
                ]
              : options),
          ],
        };
      },
      [getIntentByID, triggersMapByDiagramID, referenceSystem, globalTriggerNodeIDsByIntentIDMapByDiagramIDMap]
    ),
  });

  const onSelect = (value: string | null) => {
    const map = workflowOptionMap;
    const option = value ? map[value] : null;

    if (!option || !('intentID' in option)) {
      onChange(null);
      return;
    }

    onChange({ intentID: option.intentID, diagramID: option.diagramID });
  };

  const stepID = globalIntentStepMap[value?.diagramID ?? '']?.[value?.intentID ?? '']?.[0] ?? null;
  const combinedValue = value?.diagramID && stepID ? createCombinedID(value.diagramID, value.intentID) : null;

  return (
    <Select<GroupOption | UIOnlyMenuItemOption, string>
      {...props}
      value={combinedValue}
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
        (({ close, search }: { close: VoidFunction; search: string }) => (
          <Menu.NotFound>
            {!search ? 'No open intents exists in your agent. ' : 'No open intents found. '}
            <Link href={Documentation.OPEN_INTENT} onClick={close}>
              Learn more
            </Link>
          </Menu.NotFound>
        ))
      }
    />
  );
};

export default GoToIntentSelect;
