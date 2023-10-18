import { Dropdown, stopPropagation, SvgIcon, System, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

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
  icon,
  disabled,
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
    const selectionIsCollapsed = store.getEditorState().getSelection().isCollapsed();

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

  const renderTrigger = ({ onOpenMenu, onHideMenu, isOpen }) => (
    <TippyTooltip content={addLabel} position="top" offset={[0, 0]}>
      <System.IconButton.Base
        icon={icon}
        size={System.IconButton.Size.S}
        active={isOpen}
        onClick={isOpen ? onHideMenu : onOpenMenu}
        hoverBackground={false}
        activeBackground={false}
        disabled={disabled}
      />
    </TippyTooltip>
  );

  return (
    <Wrapper>
      <FullWidthWrapper onClick={stopPropagation()}>
        {!!additionalControlsRenderer && additionalControlsRenderer({ store, globalStore })}

        <ControlsWrapper>
          {!!tagsHistory.length && historyTooltip && (
            <Dropdown onClose={onHideFakeSelection} onSelect={onAddTag} options={tagsHistory} placement="bottom-end">
              {({ ref, onToggle, isOpen }) => (
                <TippyTooltip content={historyTooltip} position="top">
                  <HistoryWrapper
                    onClick={(e) => {
                      onShowFakeSelection();
                      onToggle(e);
                    }}
                    ref={ref}
                    isOpen={isOpen}
                  >
                    <SvgIcon icon="clock" />
                  </HistoryWrapper>
                </TippyTooltip>
              )}
            </Dropdown>
          )}

          <TagsSelect
            label={addLabel}
            onOpen={onShowFakeSelection}
            onClose={onHideFakeSelection}
            options={addOptions}
            minWidth={false}
            useLayers
            icon={icon}
            onSelect={onAddTag}
            autoWidth={false}
            placement="bottom-end"
            borderLess
            isDropdown
            searchable
            inputProps={{ styles: { color: '#62778c' } }}
            getOptionKey={(option) => option.name}
            getOptionLabel={(value) => value?.name}
            inDropdownSearch
            alwaysShowCreate
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
            isMultiLevel
            createInputPlaceholder={tagsSearchPlaceholder}
            renderTrigger={icon && renderTrigger}
            disabled={disabled}
          />
        </ControlsWrapper>
      </FullWidthWrapper>
    </Wrapper>
  );
}
