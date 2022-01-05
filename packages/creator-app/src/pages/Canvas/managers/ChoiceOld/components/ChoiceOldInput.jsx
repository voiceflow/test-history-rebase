import { Utils, VALID_SAMPLE_UTTERANCE } from '@voiceflow/common';
import { Input } from '@voiceflow/ui';
import React from 'react';

import ListManager from '@/components/ListManager';
import { FormControl } from '@/pages/Canvas/components/Editor';

const TOKEN_PATTERN = /({{\[)|(].[\dA-Za-z]+}})/g;

const validateFormValue = (value) => {
  const escapedValue = value.replace(TOKEN_PATTERN, '');
  if (escapedValue.match(VALID_SAMPLE_UTTERANCE)) {
    return {
      valid: false,
      error:
        'Sample choices can consist of only unicode characters, spaces, periods for abbreviations, underscores, possessive apostrophes, curly braces, and hyphens',
    };
  }

  return { valid: true };
};

const ChoiceInput = ({ choice, onChange }) => {
  const updateSynonyms = React.useCallback((synonyms) => onChange({ synonyms }), [onChange]);

  return (
    <FormControl>
      <ListManager
        items={choice.synonyms}
        addToStart
        addValidation={validateFormValue}
        onUpdate={updateSynonyms}
        renderForm={({ value, onAdd, onChange }) => (
          <Input
            value={value}
            placeholder="Enter user reply"
            onEnterPress={Utils.functional.chain(
              () => onAdd(value || ''),
              () => onChange('')
            )}
            onChangeText={onChange}
          />
        )}
        renderItem={(item, { onUpdate }) => <Input value={item} onChangeText={onUpdate} placeholder="User reply synonyms" />}
      />
    </FormControl>
  );
};

export default ChoiceInput;
