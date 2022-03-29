import _sortBy from 'lodash/sortBy';
import React from 'react';

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
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

export const useFilteredList = (search: string, list: { name: string }[]) => {
  return React.useMemo(() => {
    return list.filter((item) => {
      return item.name.includes(search.trim());
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
