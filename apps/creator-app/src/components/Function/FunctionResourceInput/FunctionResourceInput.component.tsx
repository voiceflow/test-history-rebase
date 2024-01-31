import { FocusIndicator, Input } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { IFunctionResourceInput } from './FunctionResourceInput.interface';
import { replaceSpacesWithUnderscores } from './FunctionResourceInput.utils';

export const FunctionResourceInput: React.FC<IFunctionResourceInput> = ({
  onDescriptionChange,
  onValueChange,
  onEmpty,
  value: valueProp,
  descriptionPlaceholder,
  namePlaceholder,
  description,
  autoFocus,
  testID,
}) => {
  const descriptionInput = useInput({
    onSave: (value) => onDescriptionChange(value),
    isEmpty: () => !valueProp,
    value: description,
    onEmpty,
  });

  const valueInput = useInput({
    onSave: (value) => onValueChange(value),
    value: valueProp,
    autoFocus,
    onEmpty,
  });

  return (
    <FocusIndicator.Container pl={24} overflow="hidden">
      <Input.TwoLine
        firstLineProps={{
          ...valueInput.attributes,
          onValueChange: (value) => valueInput.setValue(replaceSpacesWithUnderscores(value) || ''),
          placeholder: namePlaceholder,
        }}
        secondLineProps={{
          ...descriptionInput.attributes,
          onValueChange: (value) => descriptionInput.setValue(value),
          placeholder: descriptionPlaceholder,
          multiple: true,
        }}
        testID={testID}
      />
    </FocusIndicator.Container>
  );
};
