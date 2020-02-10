import { constants } from '@voiceflow/common';
import React from 'react';

import ListManager, { ListManagerForm } from '@/components/ListManager';
import { useManager } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';

const TOKEN_PATTERN = /({{\[)|(].[\dA-Za-z]+}})/g;
const { sampleUtteranceRegex } = constants.regex;

const validateFormValue = (value) => {
  const escapedValue = value.replace(TOKEN_PATTERN, '');
  if (escapedValue.match(sampleUtteranceRegex)) {
    return 'Sample choices can consist of only unicode characters, spaces, periods for abbreviations, underscores, possessive apostrophes, curly braces, and hyphens';
  }
};

const ChoiceInput = ({ choice, onChange }) => {
  const updateSynonyms = React.useCallback((synonyms) => onChange({ synonyms }), [onChange]);
  const synonymManager = useManager(choice.synonyms, updateSynonyms);

  const addUtterance = React.useCallback((value) => synonymManager.onAdd(value), [synonymManager.onAdd]);
  return (
    <FormControl>
      <ListManager
        placeholder={choice.synonyms.length ? 'Enter synonyms of the user reply' : 'Enter user reply'}
        validate={validateFormValue}
        {...synonymManager}
        onAdd={addUtterance}
        inputComponent={ListManagerForm}
      />
    </FormControl>
  );
};

export default ChoiceInput;
