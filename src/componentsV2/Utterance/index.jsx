// eslint-disable-next-line no-secrets/no-secrets
import createMentionPlugin, { defaultSuggestionsFilter } from '@voiceflow/draft-js-mention-plugin';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import debounce from 'lodash/debounce';
import React from 'react';
import lifecycle from 'recompose/lifecycle';

import { draftJSContentAdapter } from '@/client/adapters/utterance';
import DraftJSEditor from '@/components/DraftJSEditor';
import { useToggle } from '@/hooks';

import Entry from './components/Entry';
import Popover from './components/Popover';
import Portal from './components/Portal';
import Slot from './components/Slot';

const cleanUpSlotName = (value = '') => value.trim().replace(/ /g, '_');

const DEBOUNCE_TIMEOUT = 300;

const createEditorState = (value, slots) =>
  EditorState.set(value ? EditorState.createWithContent(convertFromRaw(draftJSContentAdapter.toDB(value, slots))) : EditorState.createEmpty(), {
    allowUndo: false,
  });

const EMPTY_ARRAY = [];
const EMPTY_SUGGESTIONS = [{ id: 'EMPTY', name: '' }];

function Utterance({ space, value, slots = EMPTY_ARRAY, onChange, onAddSlot, characters = '' }) {
  const mentionRef = React.useRef();

  const slotsMap = React.useMemo(() => slots.reduce((obj, slot) => Object.assign(obj, { [slot.name]: slot }), {}), [slots]);
  const variableReplaceRegexp = React.useMemo(() => new RegExp(`[^\\w${characters}_ :]`, 'g'));

  const [isOpen, toggleOpen] = useToggle(false);
  const [slotName, updateSlotName] = React.useState('');
  const [isForceOpen, toggleForceOpen] = useToggle(false);
  const [searchValue, updateSearchValue] = React.useState('');
  const [suggestions, updateSuggestions] = React.useState(slots);
  const [editorState, updateEditorState] = React.useState();
  const mentionPlugin = React.useMemo(
    () =>
      createMentionPlugin({
        mentionRegExp: `[\\w${characters}-]*`,
        mentionPrefix: '{',
        mentionSuffix: '}',
        mentionTrigger: '{',
        entityMutability: 'IMMUTABLE',
        mentionComponent: Slot,
        supportWhitespace: true,
        mentionSuggestionsPortalComponent: Portal,
      }),
    []
  );

  const plugins = React.useMemo(() => [mentionPlugin]);

  const onCreateSlot = React.useCallback(
    async (addSlotInToEditor) => {
      toggleForceOpen(true);

      if (onAddSlot) {
        const mention = await onAddSlot(slotName);

        addSlotInToEditor(mention);
      }

      toggleForceOpen(false);
    },
    [onAddSlot, slotName, toggleForceOpen]
  );

  const onDebouncedChange = React.useMemo(
    () =>
      debounce((newEditorState) => {
        onChange && onChange(draftJSContentAdapter.fromDB(convertToRaw(newEditorState.getCurrentContent())));
      }, DEBOUNCE_TIMEOUT),
    [onChange]
  );

  const onEditorChange = React.useCallback(
    (newEditorState) => {
      updateEditorState(newEditorState);
      onDebouncedChange(newEditorState);
    },
    [onDebouncedChange, updateEditorState]
  );

  const onChangeSlotName = React.useCallback(
    ({ target }) => {
      updateSlotName(cleanUpSlotName(target.value));
    },
    [updateSlotName]
  );

  const onMentionSearchChange = React.useCallback(
    ({ value }) => {
      const { found, suggestions: filteredSuggestions } = defaultSuggestionsFilter(value, slots, { size: 5, showNotMatched: true });

      updateSearchValue(value);
      updateSlotName(cleanUpSlotName(value));
      updateSuggestions(filteredSuggestions);

      mentionRef.current?.setFocus(found ? 0 : -1);
    },
    [slots, mentionRef.current]
  );

  React.useEffect(() => {
    updateEditorState(createEditorState(value, slots));
  }, [slotsMap]);

  return (
    <div>
      {editorState && (
        <>
          <DraftJSEditor
            plugins={plugins}
            onChange={onEditorChange}
            editorState={editorState}
            placeholder="Enter Text Here"
            stripPastedStyles={true}
          />

          <mentionPlugin.MentionSuggestions
            ref={mentionRef}
            open={isOpen || isForceOpen}
            suggestions={suggestions.length ? suggestions : EMPTY_SUGGESTIONS}
            onOpenChange={toggleOpen}
            entryComponent={Entry}
            suggestionsMap={slotsMap}
            onSearchChange={onMentionSearchChange}
            onCreateMention={onCreateSlot}
            popoverComponent={
              <Popover
                slotName={slotName}
                slotsMap={slotsMap}
                searchValue={searchValue}
                onBlurInput={() => toggleForceOpen(false)}
                onFocusInput={() => toggleForceOpen(true)}
                onChangeSlotName={onChangeSlotName}
              />
            }
            spaceAfterNewMention={space}
            searchValueReplaceRegexp={variableReplaceRegexp}
          />
        </>
      )}
    </div>
  );
}

export default lifecycle({
  componentDidCatch() {
    this.forceUpdate();
  },
})(Utterance);
