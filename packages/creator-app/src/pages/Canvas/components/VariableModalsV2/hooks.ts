import { toast } from '@voiceflow/ui';
import React from 'react';

import { CanvasCreationType } from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import { useDispatch } from '@/hooks';
import { useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';

export const useCreateVariables = ({ onCreate }: { onCreate?: (names: string[]) => void }) => {
  const { mergedVariables } = useOrderedVariables();
  const createGlobalVars = useDispatch(Version.addManyGlobalVariables);

  const existingVariableNames = React.useMemo(() => {
    return mergedVariables.map((variable) => {
      return variable.name;
    });
  }, [mergedVariables]);

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
    [mergedVariables, onCreate]
  );

  return {
    onCreateMultiple,
    onCreateSingle,
  };
};
