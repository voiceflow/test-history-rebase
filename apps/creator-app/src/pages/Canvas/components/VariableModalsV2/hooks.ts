import { toast } from '@voiceflow/ui';
import React from 'react';

import { CanvasCreationType } from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import { useDispatch, useOrderedVariables } from '@/hooks';

const formatVarName = (name: string) => name.trim().replace(/ /g, '_');

export const useCreateVariables = ({
  onCreated,
  creationType = CanvasCreationType.IMM,
}: {
  onCreated?: (names: string[]) => void;
  creationType?: CanvasCreationType;
} = {}) => {
  const [variables] = useOrderedVariables();
  const [isCreating, setIsCreating] = React.useState(false);
  const addGlobalVariable = useDispatch(Version.addGlobalVariable);
  const addManyGlobalVariables = useDispatch(Version.addManyGlobalVariables);

  const existingVariableNames = React.useMemo(() => variables.map((variable) => variable.name), [variables]);

  const isExist = (name: string) => existingVariableNames.includes(name);

  const onCreateSingle = async (name: string) => {
    if (isExist(name)) {
      toast.warn(`'${name}' already exists`);
      return;
    }

    try {
      setIsCreating(true);

      await addGlobalVariable(formatVarName(name), creationType);

      onCreated?.([name]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create variable');

      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const onCreateMultiple = async (names: string) => {
    const variables = names
      .split(',')
      .map(formatVarName)
      .filter((name) => !isExist(name));

    try {
      setIsCreating(true);

      const newVariables = await addManyGlobalVariables(variables, creationType);

      if (newVariables.length) {
        toast.success(`${newVariables.length} variable(s) successfully created`);
        onCreated?.(newVariables);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create variables');

      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    onCreateSingle,
    onCreateMultiple,
  };
};
