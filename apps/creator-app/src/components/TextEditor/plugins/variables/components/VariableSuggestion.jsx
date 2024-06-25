import { useToggle } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

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
  notFoundMessage = 'No variables found.',
  notExistMessage = 'No variables exist.',
  suggestOnSelection,
  MentionSuggestions,
  createInputPlaceholder,
}) {
  const mentionRef = React.useRef();

  const sortedVariables = React.useMemo(() => _sortBy(variables, 'name'), [variables]);
  const variablesMap = React.useMemo(
    () => sortedVariables.reduce((obj, slot) => Object.assign(obj, { [slot.name]: slot }), {}),
    [sortedVariables]
  );

  const variableReplaceRegexp = React.useMemo(() => new RegExp(`[^\\w${characters}_ :]`, 'g'), [characters]);

  const [isOpen, toggleOpen] = useToggle(false);
  const [isForceOpen, toggleForceOpen] = useToggle(false);
  const [searchValue, updateSearchValue] = React.useState('');
  const [suggestions, updateSuggestions] = React.useState(sortedVariables);
  const [variableName, updateVariableName] = React.useState('');

  const opened = isOpen || isForceOpen;

  // initialize store with the default variablesMap
  if (!store.get('variablesMap')) {
    store.set('variablesMap', variablesMap);
  }

  store.merge({ ableToHandleBlur: !isForceOpen, ableToHandleReturn: !opened });

  const onMentionSearchChange = React.useCallback(
    ({ value }) => {
      const filteredSuggestions = sortedVariables.filter((suggestion) => suggestion.name.toLowerCase().includes(value));

      updateSearchValue(value);
      updateVariableName(cleanUpVariableName(value));
      updateSuggestions(filteredSuggestions);

      mentionRef.current?.setFocus(filteredSuggestions.length ? 0 : -1);
    },
    [sortedVariables]
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
    if (
      variablesMap !== store.get('variablesMap') &&
      Object.keys(variablesMap).length <= Object.keys(savedVariablesMap).length
    ) {
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
          isEmpty={suggestions.length === 0}
          creatable={creatable}
          placeholder={createInputPlaceholder}
          onBlurInput={() => !store.get('creating') && toggleForceOpen(false)}
          searchValue={searchValue}
          variableName={variableName}
          onFocusInput={() => toggleForceOpen(true)}
          variablesMap={variablesMap}
          notExistMessage={notExistMessage}
          notFoundMessage={notFoundMessage}
          onChangeVariableName={onMentionSearchChange}
        />
      }
      suggestOnSelection={suggestOnSelection}
      spaceAfterNewMention={space}
      searchValueReplaceRegexp={variableReplaceRegexp}
    />
  );
}

export default VariableSuggestion;
