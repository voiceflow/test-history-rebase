import { IconButton, IconButtonVariant, TippyTooltip } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useModals, useSelector } from '@/hooks';
import { VariableType } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/constants';
import { Variable } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/types';
import { addPrefix } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/utils';
import ListItem from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/components/ListItem';
import { useSectionHooks } from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

import { SectionSection } from '.';
import { SectionProps } from './types';

const createVariablesList = (type: VariableType, variables: string[]) =>
  variables.map((variable) => ({ id: addPrefix(type, variable), name: variable, type }));

const VariablesSection: React.FC<SectionProps> = ({ search, setSearchLength, selectedID, setSelectedItemID, setActiveTab }) => {
  const { activeTab } = React.useContext(NLUQuickViewContext);

  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.VARIABLES, [activeTab]);
  const { open: openVariableCreate } = useModals(ModalType.VARIABLE_CREATE);
  const [justAddedVariables, setJustAddedVariables] = React.useState<string[] | null>(null);

  const removeGlobalVariable = useDispatch(Version.removeGlobalVariable);
  const removeVariableFromDiagram = useDispatch(Diagram.removeActiveDiagramVariable);

  const localVariables = useSelector(DiagramV2.active.localVariablesSelector);
  const globalVariables = useSelector(VersionV2.active.globalVariablesSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const [mergedVariables, mergedVariablesMap] = React.useMemo(() => {
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
    list: mergedVariables,
    map: mergedVariablesMap,
  });

  // Auto select first new variable on creation
  React.useEffect(() => {
    const firstAddedVariable = justAddedVariables?.[0];
    if (!firstAddedVariable) return;
    mergedVariables.forEach((variable) => {
      if (variable.name === firstAddedVariable) {
        setSelectedItemID(variable.id);
      }
    });
  }, [justAddedVariables, mergedVariables]);

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

  const onCreateVariable = () => {
    openVariableCreate({
      onCreate: (variableNames: string[]) => {
        if (variableNames.length) {
          setJustAddedVariables(variableNames);
        }
      },
    });
  };

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
      {filteredVariables.map((variable) => (
        <ListItem
          id={variable.id}
          active={selectedID === variable.id}
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
