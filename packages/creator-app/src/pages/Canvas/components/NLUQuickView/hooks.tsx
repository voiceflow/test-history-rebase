import _sortBy from 'lodash/sortBy';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { VariableType } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/constants';
import { Variable } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/types';
import { addPrefix } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/utils';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

export const useFilteredList = (search: string, list: { name: string }[]) => {
  return React.useMemo(() => {
    return list.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase().trim());
    });
  }, [search, list]);
};

export const useOrderedIntents = () => {
  const allIntents = useSelector(IntentV2.allCustomIntentsSelector);

  const sortedIntents = React.useMemo(() => _sortBy(allIntents, (intent) => intent.name.toLowerCase()), [allIntents]);

  return {
    sortedIntents,
  };
};

export const useOrderedEntities = () => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  const sortedSlots = React.useMemo(() => _sortBy(allSlots, (slot) => slot.name?.toLowerCase()), [allSlots]);

  return {
    sortedSlots,
  };
};

const createVariablesList = (type: VariableType, variables: string[]) =>
  variables.map((variable) => ({ id: addPrefix(type, variable), name: variable, type }));

export const useOrderedVariables = () => {
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
  }, [localVariables, globalVariables]);

  return {
    mergedVariables,
    mergedVariablesMap,
  };
};

export const useDeleteVariable = () => {
  const removeGlobalVariable = useDispatch(Version.removeGlobalVariable);
  const removeVariableFromDiagram = useDispatch(Diagram.removeActiveDiagramVariable);
  const { mergedVariables, mergedVariablesMap } = useOrderedVariables();

  return React.useCallback(
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
};

export const useShowForms = () => {
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);
  const slotsMap = useSelector(SlotV2.slotMapSelector);
  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const slots = useSelector(SlotV2.allSlotsSelector);

  const { activeTab, selectedID } = React.useContext(NLUQuickViewContext);

  const showIntentForm = activeTab === InteractionModelTabType.INTENTS && intentsMap[selectedID];
  const showEntityForm = activeTab === InteractionModelTabType.SLOTS && slotsMap[selectedID];
  const showVariableForm = activeTab === InteractionModelTabType.VARIABLES;

  const isEmpty = React.useMemo(() => {
    if (activeTab === InteractionModelTabType.INTENTS && allIntents.length === 0) {
      return true;
    }
    if (activeTab === InteractionModelTabType.SLOTS && slots.length === 0) {
      return true;
    }
    return false;
  }, [allIntents, activeTab, slots]);

  return {
    showIntentForm,
    showEntityForm,
    showVariableForm,
    isEmpty,
  };
};
