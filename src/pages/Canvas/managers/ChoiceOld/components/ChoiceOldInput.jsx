import { constants } from '@voiceflow/common';
import React from 'react';

import Input from '@/components/Input';
import ListManager from '@/components/ListManager';
import { FormControl } from '@/pages/Canvas/components/Editor';

const TOKEN_PATTERN = /({{\[)|(].[\dA-Za-z]+}})/g;
const { sampleUtteranceRegex } = constants.regex;

const validateFormValue = (value) => {
  const escapedValue = value.replace(TOKEN_PATTERN, '');
  if (escapedValue.match(sampleUtteranceRegex)) {
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
            placeholder="Enter user reply"
            value={value}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                onAdd(event.target.value);
                onChange('');
              }
            }}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        renderItem={(item, { onUpdate }) => <Input value={item} onChange={(e) => onUpdate(e.target.value)} placeholder="User reply synonyms" />}
      />
    </FormControl>
  );
};

export default ChoiceInput;
