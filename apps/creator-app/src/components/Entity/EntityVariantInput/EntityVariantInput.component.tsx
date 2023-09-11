import { FocusIndicator, Input } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { IEntityVariantInput } from './EntityVariantInput.interface';
import { isSynonymsStringEmpty } from './EntityVariantInput.util';

export const EntityVariantInput: React.FC<IEntityVariantInput> = ({
  value: valueProp,
  onEmpty,
  synonyms,
  autoFocus,
  onValueChange,
  onSynonymsChange,
}) => {
  const synonymsInput = useInput<string[], string>({
    value: synonyms,
    onSave: (value) => onSynonymsChange(value.split(',').map((synonym) => synonym.trim())),
    onEmpty,
    isEmpty: (value) => !valueProp && isSynonymsStringEmpty(value),
    transform: (synonyms) => synonyms.join(', '),
  });

  const valueInput = useInput({
    value: valueProp,
    onSave: onValueChange,
    onEmpty,
    isEmpty: (value) => !value && isSynonymsStringEmpty(synonymsInput.value),
    autoFocus,
  });

  return (
    <FocusIndicator.Container pl={24} overflow="hidden">
      <Input.TwoLine
        firstLineProps={{
          ...valueInput.attributes,
          placeholder: 'Enter entity value',
        }}
        secondLineProps={{
          ...synonymsInput.attributes,
          placeholder: 'Add synonyms, comma separated',
        }}
      />
    </FocusIndicator.Container>
  );
};
