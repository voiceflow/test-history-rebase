import { toast } from '@voiceflow/ui';
import React from 'react';

import { CanvasCreationType } from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import { useDispatch } from '@/hooks';
import { useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';

export const useCreateVariables = ({ onCreate }: { onCreate?: (names: string[]) => void }) => {
  const { mergedVariables } = useOrderedVariables();
  const createGlobalVar = useDispatch(Version.addGlobalVariable);
  const existingVariableNames = React.useMemo(() => {
    return mergedVariables.map((variable) => {
      return variable.name;
    });
  }, [mergedVariables]);

  const varAlreadyExists = (name: string) => existingVariableNames.includes(name);

  const onCreateSingle = (varName: string) => {
    if (!varAlreadyExists(varName)) {
      try {
        createGlobalVar(varName, CanvasCreationType.IMM);
      } catch (e) {
        toast.error(e);
      }
    } else {
      toast.warn(`'${varName}' already exists`);
    }
  };
  const onCreateMultiple = React.useCallback(
    (commaSeparatedNames: string) => {
      const allNewVars = commaSeparatedNames.split(',');
      const newVarNames: string[] = [];

      allNewVars.forEach((newVar: string) => {
        const name = newVar.trim().replace(' ', '_');
        if (!varAlreadyExists(name)) {
          if (!newVarNames.includes(name)) {
            newVarNames.push(name);
            try {
              createGlobalVar(name, CanvasCreationType.IMM);
            } catch (e) {
              toast.error(e);
            }
          }
        } else {
          toast.warn(`'${name}' already exists`);
        }
      });

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
