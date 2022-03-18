import { IconButton, IconButtonVariant, TippyTooltip, toast, useDidUpdateEffect } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { CanvasCreationType } from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { VariableType } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/constants';
import { Variable } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/types';
import { addPrefix } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/utils';
import ListItem from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/components/ListItem';
import { useSectionHooks } from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/hooks';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

import { SectionSection } from '.';
import { SectionProps } from './types';

const createVariablesList = (type: VariableType, variables: string[]) =>
  variables.map((variable) => ({ id: addPrefix(type, variable), name: variable, type }));

const VariablesSection: React.FC<SectionProps> = ({ setTitle, search, setSearchLength, selectedID, setSelectedItemID, setActiveTab, activeTab }) => {
  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.VARIABLES, [activeTab]);

  const removeGlobalVariable = useDispatch(Version.removeGlobalVariable);
  const removeVariableFromDiagram = useDispatch(Diagram.removeActiveDiagramVariable);
  const createGlobalVariable = useDispatch(Version.addGlobalVariable);

  const localVariables = useSelector(DiagramV2.active.localVariablesSelector);
  const globalVariables = useSelector(VersionV2.active.globalVariablesSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const [isCreating, setIsCreating] = React.useState(false);
  const newItemInputRef = React.useRef<HTMLInputElement>(null);

  const [newVariableName, setNewVariableName] = React.useState('');

  const [mergedVariables, mergedVariablesMap, mergedVariableNameMap] = React.useMemo(() => {
    const variables = {
      [VariableType.LOCAL]: localVariables,
      [VariableType.GLOBAL]: globalVariables,
      [VariableType.BUILT_IN]: getPlatformGlobalVariables(platform),
    };

    const list = Object.entries(variables).flatMap(([type, variables]) =>
      _sortBy(createVariablesList(type as VariableType, variables), (variable) => variable.name.toLowerCase())
    );

    const map = list.reduce<Record<string, Variable>>((acc, item) => Object.assign(acc, { [item.id]: item }), {});

    const nameMap = list.reduce<Record<string, Variable>>((acc, item) => Object.assign(acc, { [item.name]: item }), {});

    return [list, map, nameMap];
  }, [localVariables, globalVariables, localVariables]);

  useSectionHooks({
    setSearchLength,
    listLength: mergedVariables.length,
    isActiveTab,
    selectedID,
    setSelectedItemID,
    list: mergedVariables,
    map: mergedVariablesMap,
    setTitle,
  });

  const filteredVariables = React.useMemo(() => {
    return mergedVariables.filter((variable) => {
      return variable.name.includes(search.trim());
    });
  }, [search, mergedVariables]);

  const onDeleteVariable = React.useCallback(
    (variableID: string) => {
      const variable = mergedVariablesMap[variableID];

      if (variable.type === VariableType.GLOBAL) {
        removeGlobalVariable(variable.name);
      } else {
        removeVariableFromDiagram(variable.name);
      }
    },
    [removeGlobalVariable, removeVariableFromDiagram, mergedVariables]
  );

  const onCreateVariable = async () => {
    setIsCreating(true);
  };

  const onConfirmCreate = async (newName: string) => {
    try {
      setIsCreating(false);
      await createGlobalVariable(newName, CanvasCreationType.IMM);
      setNewVariableName(newName);
    } catch (e) {
      setIsCreating(true);
      toast.error(e.message);
      newItemInputRef.current?.focus();
    }
  };

  const newVariableID = React.useMemo(() => mergedVariableNameMap[newVariableName]?.id, [mergedVariableNameMap, newVariableName]);

  useDidUpdateEffect(() => {
    setSelectedItemID(newVariableID);
  }, [newVariableID]);

  return (
    <SectionSection
      isExpanded={isActiveTab && !!filteredVariables.length}
      onClick={() => setActiveTab(InteractionModelTabType.VARIABLES)}
      isCollapsed={!isActiveTab}
      header="Variables"
      headerToggle
      collapseVariant={isActiveTab ? null : SectionToggleVariant.ARROW}
      suffix={
        isActiveTab && (
          <TippyTooltip title="Create variable" position="top">
            <IconButton style={{ marginRight: -12 }} onClick={onCreateVariable} variant={IconButtonVariant.BASIC} icon="plus" />
          </TippyTooltip>
        )
      }
    >
      {isCreating && (
        <ListItem
          ref={newItemInputRef}
          id="new-variable"
          onBlur={onConfirmCreate}
          active
          onClick={() => {}}
          key="new-variable"
          name="new_variable"
          onDelete={() => {}}
          nameValidation={(name) => name.replace(' ', '_')}
          isCreating
          activeTab={activeTab}
        />
      )}
      {filteredVariables.map((variable) => (
        <ListItem
          id={variable.id}
          active={selectedID === variable.id}
          activeTab={activeTab}
          onClick={() => setSelectedItemID(variable.id)}
          key={variable.id}
          name={variable.name}
          onDelete={onDeleteVariable}
          nameValidation={(text) => text}
        />
      ))}
    </SectionSection>
  );
};

export default VariablesSection;
