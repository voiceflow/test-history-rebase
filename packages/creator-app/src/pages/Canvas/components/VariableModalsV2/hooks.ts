import { toast } from '@voiceflow/ui';
import React from 'react';

import { CanvasCreationType } from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import { useDispatch, useOrderedVariables } from '@/hooks';

export const useCreateVariables = ({ onCreate }: { onCreate?: (names: string[]) => void }) => {
  const [variables] = useOrderedVariables();
  const createGlobalVars = useDispatch(Version.addManyGlobalVariables);

  const existingVariableNames = React.useMemo(() => variables.map((variable) => variable.name), [variables]);

  const varAlreadyExists = (name: string) => existingVariableNames.includes(name);

  const formatVarName = (name: string) => {
    return name.trim().replace(/ /g, '_');
  };

  const onCreateSingle = (varName: string) => {
    if (!varAlreadyExists(varName)) {
      try {
        createGlobalVars([formatVarName(varName)], CanvasCreationType.IMM);
      } catch (e) {
        toast.error(e);
      }
    } else {
      toast.warn(`'${varName}' already exists`);
    }
  };
  const onCreateMultiple = React.useCallback(
    async (commaSeparatedNames: string) => {
      const allNewVars = commaSeparatedNames.split(',');
      let newVarNames: string[] = [];

      newVarNames = allNewVars.map(formatVarName).filter((name) => !varAlreadyExists(name));
      await createGlobalVars(newVarNames, CanvasCreationType.IMM);

      if (newVarNames.length) {
        toast.success(`${newVarNames.length} variable(s) successfully created`);
        onCreate?.(newVarNames);
      }
    },
    [variables, onCreate]
  );

  return {
    onCreateMultiple,
    onCreateSingle,
  };
};
