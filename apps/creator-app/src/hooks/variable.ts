import { SLOT_REGEXP } from '@voiceflow/common';
import React from 'react';

import type { VariableType } from '@/constants';
import { useVariablePromptModal } from '@/hooks/modal.hook';
import { deepVariableReplacement, deepVariableSearch } from '@/utils/variable';

export interface OrderedVariable {
  id: string;
  type: VariableType;
  name: string;
}

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
