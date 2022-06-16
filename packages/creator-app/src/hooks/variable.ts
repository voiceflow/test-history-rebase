import { Utils } from '@voiceflow/common';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { VariableType } from '@/constants';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';
import { addVariablePrefix } from '@/utils/variable';

export const useVariableCreation = () => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);
  const addVariable = useDispatch(Version.addGlobalVariable);

  const createVariable = async (item: string) => {
    if (!item) return;
    await addVariable(item, CanvasCreationType.EDITOR);
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
  const platform = useSelector(ProjectV2.active.platformSelector);
  const localVariables = useSelector(DiagramV2.active.localVariablesSelector);
  const globalVariables = useSelector(VersionV2.active.globalVariablesSelector);

  return React.useMemo(() => {
    const variables = {
      [VariableType.LOCAL]: localVariables,
      [VariableType.GLOBAL]: globalVariables,
      [VariableType.BUILT_IN]: getPlatformGlobalVariables(platform),
    };

    const list = Object.entries(variables).flatMap(([type, variables]) =>
      _sortBy(createVariablesList(type as VariableType, variables), (variable) => variable.name.toLowerCase())
    );

    const map = Utils.array.createMap(list, (item) => item.id);

    return [list, map] as const;
  }, [localVariables, globalVariables]);
};
