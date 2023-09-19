import { toast } from '@voiceflow/ui-next';
import React from 'react';

import { SPACE_REGEXP } from '@/constants';
import { CanvasCreationType } from '@/ducks/tracking';
import * as Version from '@/ducks/versionV2';
import { useDispatch } from '@/hooks/realtime';

const formatVarName = (name: string) => name.trim().replace(SPACE_REGEXP, '_');

export const useCreateVariables = ({
  creationType = CanvasCreationType.IMM,
}: {
  creationType?: CanvasCreationType;
} = {}) => {
  const [isCreating, setIsCreating] = React.useState(false);
  const addGlobalVariable = useDispatch(Version.addGlobalVariable);
  const addManyGlobalVariables = useDispatch(Version.addManyGlobalVariables);

  const onCreateSingle = async (name: string) => {
    try {
      setIsCreating(true);

      await addGlobalVariable(formatVarName(name), creationType);

      return [name];
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create variable');

      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const onCreateMultiple = async (names: string) => {
    try {
      setIsCreating(true);

      const newVariables = await addManyGlobalVariables(names.split(',').map(formatVarName), creationType);

      toast.success(`${newVariables.length} variable(s) successfully created`);

      return newVariables;
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
