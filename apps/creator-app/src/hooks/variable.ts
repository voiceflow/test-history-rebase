import { SLOT_REGEXP, Utils } from '@voiceflow/common';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { VariableType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig } from '@/hooks/platformConfig';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useCreateVariableModal, useVariablePromptModal } from '@/ModalsV2/hooks';
import { addVariablePrefix, deepVariableReplacement, deepVariableSearch } from '@/utils/variable';

export const useVariableCreation = () => {
  const createVariableModal = useCreateVariableModal();

  const variables = useSelector(DiagramV2.active.allSlotNamesAndVariablesSelector);
  const addVariable = useDispatch(Version.addGlobalVariable);

  const createVariable = async (item: string): Promise<string> => {
    if (!item) {
      const [variable] = await createVariableModal.open({ single: true, creationType: CanvasCreationType.EDITOR });

      return variable;
    }

    await addVariable(item, CanvasCreationType.EDITOR);

    return item;
  };

  return { variables, createVariable };
};

export interface OrderedVariable {
  id: string;
  type: VariableType;
  name: string;
}

const createVariablesList = (type: VariableType, variables: string[]) =>
  variables.map((variable) => ({ id: addVariablePrefix(type, variable), name: variable, type }));

export const useOrderedVariables = () => {
  const builtInVariables = useActiveProjectTypeConfig().project.globalVariables;
  const localVariables = useSelector(DiagramV2.active.localVariablesSelector);
  const globalVariables = useSelector(VersionV2.active.globalVariablesSelector);

  return React.useMemo(() => {
    const variables = {
      [VariableType.LOCAL]: localVariables,
      [VariableType.GLOBAL]: globalVariables,
      [VariableType.BUILT_IN]: builtInVariables,
    };

    const list = Object.entries(variables).flatMap(([type, variables]) =>
      _sortBy(createVariablesList(type as VariableType, variables), (variable) => variable.name.toLowerCase())
    );

    const map = Utils.array.createMap(list, (item) => item.id);

    return [list, map] as const;
  }, [localVariables, globalVariables]);
};

export const useDeleteVariable = () => {
  const [, variablesMap] = useOrderedVariables();

  const removeGlobalVariable = useDispatch(Version.removeGlobalVariable);
  const removeVariableFromDiagram = useDispatch(Diagram.removeActiveDiagramVariable);

  return React.useCallback(
    (variableID: string) => {
      const variable = variablesMap[variableID];

      if (variable.type === VariableType.GLOBAL) {
        removeGlobalVariable(variable.name);
      } else {
        removeVariableFromDiagram(variable.name);
      }
    },
    [variablesMap, removeGlobalVariable, removeVariableFromDiagram]
  );
};

export const useFillVariables = () => {
  const variablePromptModal = useVariablePromptModal();

  return React.useCallback(async <T extends object>(context: T): Promise<T | null> => {
    const variablesToFill = deepVariableSearch(context, SLOT_REGEXP);

    if (!variablesToFill.length) {
      return context;
    }

    // if closed return null
    const filledVariables = await variablePromptModal.openVoid({ variablesToFill });

    if (!filledVariables) return null;

    return deepVariableReplacement(context, filledVariables, SLOT_REGEXP);
  }, []);
};
