import { FocusIndicator, Input } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { InputAPI, useInput } from '@/hooks/input.hook';
import { withEnterPress } from '@/utils/dom';

import type { IEntityVariantInput } from './EntityVariantInput.interface';
import { isSynonymsStringEmpty } from './EntityVariantInput.util';

export const EntityVariantInput: React.FC<IEntityVariantInput> = ({
  value: valueProp,
  error,
  onAdd,
  onEmpty,
  synonyms,
  disabled,
  autoFocus,
  resetError,
  onValueChange,
  onSynonymsChange,
}) => {
  const synonymsInput = useInput({
    value: useMemo(() => synonyms.join(', '), [synonyms]),
    error,
    onSave: (value) => onSynonymsChange(value.split(',').map((synonym) => synonym.trim())),
    onEmpty,
    isEmpty: (value) => !valueProp && isSynonymsStringEmpty(value),
    disabled,
  });

  const valueInput = useInput({
    value: valueProp,
    onSave: onValueChange,
    onEmpty,
    onFocus: resetError,
    isEmpty: (value) => !value && isSynonymsStringEmpty(synonymsInput.value),
    disabled,
    autoFocus,
  });

  const onEnterPress = (opponentInput: InputAPI<string, HTMLInputElement>) =>
    withEnterPress<React.KeyboardEvent<HTMLInputElement>>((event) => {
      if (!event.currentTarget.value) return;

      if (!opponentInput.value) {
        opponentInput.ref.current?.focus();

        return;
      }

      onAdd();
    });

  return (
    <FocusIndicator.Container pl={24} error={synonymsInput.errored} overflow="hidden">
      <Input.TwoLine
        firstLineProps={{
          ...valueInput.attributes,
          onKeyUp: onEnterPress(synonymsInput),
          placeholder: 'Enter entity value',
        }}
        secondLineProps={{
          ...synonymsInput.attributes,
          value: synonymsInput.errorMessage || synonymsInput.value,
          onKeyUp: onEnterPress(valueInput),
          placeholder: 'Add synonyms, comma separated',
        }}
      />
    </FocusIndicator.Container>
  );
};
