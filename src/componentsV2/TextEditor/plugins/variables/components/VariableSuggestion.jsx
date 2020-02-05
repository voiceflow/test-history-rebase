import { defaultSuggestionsFilter } from '@voiceflow/draft-js-mention-plugin';
import React from 'react';

import { useToggle } from '@/hooks';

import { cleanUpVariableName } from '../utils';
import Entry from './Entry';
import Popover from './Popover';

const EMPTY_ARRAY = [];
const EMPTY_SUGGESTIONS = [{ id: 'EMPTY', name: '' }];

function VariableSuggestion({
  store,
  space,
  variables = EMPTY_ARRAY,
  creatable = true,
  characters = '',
  globalStore,
  onAddVariable,
  onVariableAdded,
  suggestOnSelection,
  MentionSuggestions,
  createInputPlaceholder,
}) {
  const mentionRef = React.useRef();

  const variablesMap = React.useMemo(() => variables.reduce((obj, slot) => Object.assign(obj, { [slot.name]: slot }), {}), [variables]);

  const variableReplaceRegexp = React.useMemo(() => new RegExp(`[^\\w${characters}_ :]`, 'g'), [characters]);

  const [isOpen, toggleOpen] = useToggle(false);
  const [isForceOpen, toggleForceOpen] = useToggle(false);
  const [searchValue, updateSearchValue] = React.useState('');
  const [suggestions, updateSuggestions] = React.useState(variables);
  const [variableName, updateVariableName] = React.useState('');

  const opened = isOpen || isForceOpen;

  // initialize store with the default variablesMap
  if (!store.get('variablesMap')) {
    store.set('variablesMap', variablesMap);
  }

  store.merge({ ableToHandleBlur: !isForceOpen, ableToHandleReturn: !opened });

  const onChangeVariableName = React.useCallback(
    ({ target }) => {
      updateVariableName(cleanUpVariableName(target.value));
    },
    [updateVariableName]
  );

  const onMentionSearchChange = React.useCallback(
    ({ value }) => {
      const { found, suggestions: filteredSuggestions } = defaultSuggestionsFilter(value, variables, { size: 5, showNotMatched: true });

      updateSearchValue(value);
      updateVariableName(cleanUpVariableName(value));
      updateSuggestions(filteredSuggestions);

      mentionRef.current?.setFocus(found ? 0 : -1);
    },
    [variables]
  );

  const onCreateSlot = React.useCallback(
    async (addSlotInToEditor, cancelCreation) => {
      toggleForceOpen(true);

      store.set('creating', true);

      if (onAddVariable) {
        const slot = await onAddVariable(variableName);

        if (slot) {
          addSlotInToEditor(slot);
        } else {
          cancelCreation();
        }

        if (slot) {
          globalStore.get('onBlurEditor')();
        }
      }

      store.set('creating', false);
      toggleForceOpen(false);
    },
    [globalStore, onAddVariable, store, toggleForceOpen, variableName]
  );

  const onAddMention = React.useCallback(
    (mention) => {
      onVariableAdded?.(mention);
      store.set('forceBlurOnStateChange', true);
    },
    [store, onVariableAdded]
  );

  React.useEffect(() => {
    const savedVariablesMap = store.get('variablesMap');

    // recreate whet the variable is updated or deleted, not created
    if (variablesMap !== store.get('variablesMap') && Object.keys(variablesMap).length <= Object.keys(savedVariablesMap).length) {
      store.merge({ variablesMap, recreateEditorState: true });
      globalStore.get('forceUpdate')?.();
    }
  }, [store, variablesMap, globalStore]);

  return (
    <MentionSuggestions
      ref={mentionRef}
      open={opened}
      creatable={creatable}
      suggestions={suggestions.length ? suggestions : EMPTY_SUGGESTIONS}
      onAddMention={onAddMention}
      onOpenChange={toggleOpen}
      entryComponent={Entry}
      suggestionsMap={variablesMap}
      onSearchChange={onMentionSearchChange}
      onCreateMention={onCreateSlot}
      popoverComponent={
        <Popover
          creatable={creatable}
          placeholder={createInputPlaceholder}
          onBlurInput={() => !store.get('creating') && toggleForceOpen(false)}
          searchValue={searchValue}
          variableName={variableName}
          onFocusInput={() => toggleForceOpen(true)}
          variablesMap={variablesMap}
          onChangeVariableName={onChangeVariableName}
        />
      }
      suggestOnSelection={suggestOnSelection}
      spaceAfterNewMention={space}
      searchValueReplaceRegexp={variableReplaceRegexp}
    />
  );
}

export default VariableSuggestion;
