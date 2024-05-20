import { FolderScope, Workflow } from '@voiceflow/dtos';
import { BlockType, FeatureFlag } from '@voiceflow/realtime-sdk';
import {
  BaseSelectProps,
  createUIOnlyMenuItemOption,
  Link,
  Menu,
  MenuItemMultilevel,
  MenuItemWithID,
  Select,
  UIOnlyMenuItemOption,
} from '@voiceflow/ui';
import React, { useCallback } from 'react';

import * as Documentation from '@/config/documentation';
import { Creator, Designer, Diagram } from '@/ducks';
import { useDomainAndDiagramMultilevelSelectOptions } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import { useFolderTree } from '@/hooks/folder.hook';
import { useSelector } from '@/hooks/store.hook';
import { isComponentDiagram } from '@/utils/diagram.utils';

import { useDiagramsIntentsOptionsMap } from './hooks';
import { Multilevel, Value } from './types';
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
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const workflows = useSelector(Designer.Workflow.selectors.all);
  const activeDiagram = useSelector(Diagram.active.diagramSelector);
  const getIntentByID = useSelector(Designer.Intent.selectors.getOneWithFormattedBuiltNameByID);
  const intentIDNodeIDMap = useSelector(Creator.intentIDNodeIDMapSelector);
  const globalIntentStepMap = useSelector(Diagram.globalIntentStepMapSelector);
  const triggersMapByDiagramID = useSelector(Designer.Workflow.selectors.triggersMapByDiagramID);

  const isComponentActive = !activeDiagram?.type || isComponentDiagram(activeDiagram.type);

  const diagramsIntentsOptions = useDiagramsIntentsOptionsMap();

  const { options, optionsMap } = useDomainAndDiagramMultilevelSelectOptions(diagramsIntentsOptions, { diagramGroupName: 'Intents' });

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
    buildFolderTree: useCallback((folder, children): GroupOption => ({ id: folder.id, label: folder.name, options: children }), []),
    buildFolderSeparator: useCallback(
      ([{ id }]: GroupOption[]): UIOnlyMenuItemOption => createUIOnlyMenuItemOption(`${id}-header`, { label: 'Folders', groupHeader: true }),
      []
    ),
    buildDataSeparator: useCallback(
      ([{ id }]: GroupOption[]): UIOnlyMenuItemOption => createUIOnlyMenuItemOption(`${id}-header`, { label: 'Workflows', groupHeader: true }),
      []
    ),
    buildDataTree: useCallback(
      (workflow, _, cacheOption): GroupOption => {
        const options = (triggersMapByDiagramID[workflow.diagramID] ?? []).reduce<Array<IntentOption | GroupOption>>((acc, triggerNode) => {
          if (triggerNode.type !== BlockType.INTENT && triggerNode.type !== BlockType.TRIGGER && triggerNode.type !== BlockType.START) return acc;

          const intent = getIntentByID({ id: triggerNode.intentID });
          const diagramGlobalStepMap = globalIntentStepMap[workflow.diagramID];

          if (!intent || !diagramGlobalStepMap[intent.id]?.length) return acc;

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
        }, []);

        return {
          id: workflow.id,
          label: workflow.name,
          options: [
            cacheOption(createUIOnlyMenuItemOption(`${workflow.id}-intents-header`, { label: 'Intents', groupHeader: true })),
            ...(!options.length
              ? [cacheOption(createUIOnlyMenuItemOption(`${workflow.id}-no-intents`, { label: 'No intents', isEmpty: true, disabled: true }))]
              : options),
          ],
        };
      },
      [getIntentByID, triggersMapByDiagramID]
    ),
  });

  const onSelect = (value: string | null) => {
    const map = cmsWorkflows.isEnabled ? workflowOptionMap : optionsMap;
    const option = value ? map[value] : null;

    if (!option || !('intentID' in option)) {
      onChange(null);
      return;
    }

    onChange({ intentID: option.intentID, diagramID: option.diagramID });
  };

  const stepID = globalIntentStepMap[value?.diagramID ?? '']?.[value?.intentID ?? '']?.[0] ?? null;
  const combinedValue = value?.diagramID && stepID ? createCombinedID(value.diagramID, value.intentID) : null;

  if (cmsWorkflows.isEnabled) {
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
              {!search ? 'No open intents exists in your assistant. ' : 'No open intents found. '}
              <Link href={Documentation.OPEN_INTENT} onClick={close}>
                Learn more
              </Link>
            </Menu.NotFound>
          ))
        }
      />
    );
  }

  const componentValue = isComponentActive && value && !!intentIDNodeIDMap[value.intentID] ? createCombinedID('', value.intentID) : null;

  return (
    <Select<Multilevel, string>
      {...props}
      value={isComponentActive && !combinedValue ? componentValue : combinedValue}
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
        (({ close, search }: { close: VoidFunction; search: string }) => (
          <Menu.NotFound>
            {!search ? 'No open intents exists in your assistant. ' : 'No open intents found. '}
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
