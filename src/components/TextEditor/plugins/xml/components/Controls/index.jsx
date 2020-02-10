import React from 'react';
import { Tooltip } from 'react-tippy';

import Dropdown from '@/components/Dropdown';
import SvgIcon from '@/components/SvgIcon';
import { stopPropagation } from '@/utils/dom';

import { addFakeSelection, addTag, removeFakeSelection } from '../../utils';
import { ControlsWrapper, FullWidthWrapper, HistoryWrapper, SelectOption, TagsSelect, Wrapper } from './components';

export { SelectOption };

const FAKE_SELECTION_CLEAR_TIMEOUT = 100;

export default function Controls({
  tags,
  store,
  addLabel,
  addOptions,
  globalStore,
  historyTooltip,
  tagsSearchPlaceholder,
  additionalControlsRenderer,
}) {
  const tagsHistory = store.getTagsToHistory();

  const onAddTag = React.useCallback(
    (data, optionsPath) => {
      if (optionsPath) {
        const { path } = optionsPath.reduce(({ path, options }, i) => ({ path: [...path, options[i]], options: options[i].options }), {
          path: [],
          options: addOptions,
        });

        const prevItem = path[path.length - 2];
        const historyLabel = prevItem ? `${prevItem.name}: ${data.name}` : data.name;

        if (historyLabel !== tagsHistory[tagsHistory.length]?.label) {
          store.addTagToHistory({ label: historyLabel, value: data });
        }
      }

      addTag(store, tags, data);

      globalStore.get('onBlurEditor')();
    },
    [store, tags, globalStore, addOptions, tagsHistory]
  );

  const onShowFakeSelection = React.useCallback(() => {
    const selectionIsCollapsed = store
      .getEditorState()
      .getSelection()
      .isCollapsed();

    if (selectionIsCollapsed || store.get('fakeSelectionKey')) {
      return;
    }

    const { editorState, key } = addFakeSelection(store.getEditorState());

    store.set('fakeSelectionKey', key);

    store.setEditorState(editorState);
  }, [store, globalStore]);

  const onHideFakeSelection = React.useCallback(() => {
    const fakeSelectionKey = store.get('fakeSelectionKey');

    if (store.getEditorState() && fakeSelectionKey) {
      store.set('fakeSelectionKey', null);
      setTimeout(() => store.setEditorState(removeFakeSelection(store.getEditorState(), fakeSelectionKey)), FAKE_SELECTION_CLEAR_TIMEOUT);
    }
  }, [store, globalStore]);

  return (
    <Wrapper>
      <FullWidthWrapper onClick={stopPropagation()}>
        {!!additionalControlsRenderer && additionalControlsRenderer({ store, globalStore })}

        <ControlsWrapper>
          {!!tagsHistory.length && (
            <Dropdown onClose={onHideFakeSelection} onSelect={onAddTag} options={tagsHistory} placement="bottom-end">
              {(ref, onToggle) => (
                <Tooltip title={historyTooltip} position="top">
                  <HistoryWrapper
                    onClick={(e) => {
                      onShowFakeSelection();
                      onToggle(e);
                    }}
                    ref={ref}
                  >
                    <SvgIcon icon="clock" />
                  </HistoryWrapper>
                </Tooltip>
              )}
            </Dropdown>
          )}

          <TagsSelect
            label={addLabel}
            onOpen={onShowFakeSelection}
            onClose={onHideFakeSelection}
            options={addOptions}
            minWidth={false}
            onSelect={onAddTag}
            autoWidth={false}
            placement="bottom-end"
            borderLess
            searchable
            getOptionKey={(option) => option.name}
            getOptionLabel={(value) => value?.name}
            renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused, optionsPath }) => (
              <SelectOption
                tag={tags[option.tag]}
                option={option}
                isFocused={isFocused}
                onAddTag={onAddTag}
                optionsPath={optionsPath}
                searchLabel={searchLabel}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
              />
            )}
            multiLevelDropdown
            createInputPlaceholder={tagsSearchPlaceholder}
          />
        </ControlsWrapper>
      </FullWidthWrapper>
    </Wrapper>
  );
}
