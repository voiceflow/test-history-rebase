import { Nullish } from '@voiceflow/common';
import { useCreateConst, useLinkedState, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { SlateEditableProps, SlateEditorAPI, SlateValue } from '@/components/SlateEditable';

export const useSlateLocalValue = (
  value?: Nullish<SlateEditableProps['value']>,
  onChange?: Nullish<SlateEditableProps['onChange']>
): [value: SlateEditableProps['value'], onChange: SlateEditableProps['onChange']] => {
  const defaultValue = useCreateConst(() => SlateEditorAPI.getEmptyState());
  const [localValue, setLocalValue] = useLinkedState(value ?? defaultValue);

  const onPersistedChange = usePersistFunction(onChange);

  const onLocalValueChange = React.useCallback((nextValue: SlateValue) => {
    setLocalValue(nextValue);
    onPersistedChange?.(nextValue);
  }, []);

  return [localValue, onLocalValueChange];
};
