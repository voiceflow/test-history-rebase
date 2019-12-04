import React from 'react';
import { Manager, Reference } from 'react-popper';

import Menu, { defaultOptionLabelRenderer } from './components/Menu';
import { SearchInput, SelectWrapper } from './components/styled';
import { defaultOptionsFilter, searchableOptionsFilter } from './optionsFilters';

const defaultGetter = (option) => option;

export { defaultOptionsFilter, searchableOptionsFilter, defaultOptionLabelRenderer };

export default function Select({
  open,
  value,
  options,
  disabled,
  onSelect,
  onCreate,
  placement = 'bottom-start',
  autoWidth = true,
  autoFocus,
  creatable,
  className,
  searchable,
  placeholder,
  optionsFilter = searchable ? searchableOptionsFilter : defaultOptionsFilter,
  getOptionValue = defaultGetter,
  getOptionLabel = defaultGetter,
  optionsMaxSize,
  isButtonDisabled,
  renderOptionLabel = defaultOptionLabelRenderer,
  createInputPlaceholder,
  showNotMatchedOptions,
}) {
  const optionLabel = getOptionLabel(value) || '';

  const cachedRef = React.useRef();

  const [opened, updateOpened] = React.useState(open);
  const [inputRef, setInputRef] = React.useState(null);
  const [searchLabel, updateSearchLabel] = React.useState(optionLabel);
  const [optionsToRender, updateOptionsToRender] = React.useState(options);
  const [focusedOptionIndex, updateFocusedOptionIndex] = React.useState(0);

  cachedRef.current = {
    value,
    opened,
    options,
    inputRef,
    creatable,
    searchable,
    optionLabel,
    searchLabel,
    optionsFilter,
    getOptionLabel,
    optionsMaxSize,
    getOptionValue,
    firstOptionIndex: creatable ? 1 : 0,
    showNotMatchedOptions,
  };

  const menuPopoverModifiers = React.useMemo(() => {
    const onComputedStyle = (data) => {
      if (placement === 'bottom-start') {
        data.styles.width = inputRef && inputRef.getBoundingClientRect().width;
      }

      return data;
    };

    return { autoSizing: { enabled: true, fn: onComputedStyle, order: 840 }, preventOverflow: { enabled: false } };
  }, [inputRef, placement]);

  const onUpdateOptionsToRender = React.useCallback(
    (label) => {
      const { filteredOptions, matchedOptions } = cachedRef.current.optionsFilter(cachedRef.current.options, label, {
        maxSize: cachedRef.current.optionsMaxSize,
        showNotMatched: cachedRef.current.showNotMatchedOptions,
        getOptionLabel: cachedRef.current.getOptionLabel,
        getOptionValue: cachedRef.current.getOptionValue,
      });

      const activeOptionIndex = matchedOptions.findIndex((option) => cachedRef.current.value === cachedRef.current.getOptionValue(option));

      if (cachedRef.current.searchable) {
        updateFocusedOptionIndex(matchedOptions.length ? cachedRef.current.firstOptionIndex : 0);
      } else {
        updateFocusedOptionIndex(activeOptionIndex === -1 ? 0 : activeOptionIndex + cachedRef.current.firstOptionIndex);
      }

      updateOptionsToRender(filteredOptions);
    },
    [updateOptionsToRender, updateFocusedOptionIndex]
  );

  const onOpenMenu = React.useCallback(() => {
    if (!cachedRef.current.opened) {
      updateOpened(true);
      onUpdateOptionsToRender(cachedRef.current.searchLabel);
    }
  }, [updateOpened, onUpdateOptionsToRender]);

  const onHideMenu = React.useCallback(() => {
    cachedRef.current.inputRef?.blur?.();

    if (cachedRef.current.searchable && cachedRef.current.searchLabel !== cachedRef.current.optionLabel) {
      updateSearchLabel(cachedRef.current.optionLabel);
    }

    updateOpened(false);
  }, [updateOpened, updateSearchLabel]);

  const onFocusOption = React.useCallback(
    (index) => {
      let nextIndex = index;

      if (index < 0) {
        nextIndex = options.length - (1 - cachedRef.current.firstOptionIndex);
      } else if (index > options.length - (1 - cachedRef.current.firstOptionIndex)) {
        nextIndex = 0;
      }

      updateFocusedOptionIndex(nextIndex);
    },
    [options.length, creatable, updateFocusedOptionIndex]
  );

  const onChangeSearchLabel = React.useCallback(
    ({ target }) => {
      onUpdateOptionsToRender(target.value);
      updateSearchLabel(target.value);
    },
    [updateSearchLabel, onUpdateOptionsToRender]
  );

  const onSelectItem = React.useCallback(
    (...args) => {
      onSelect(...args);
      onHideMenu();
    },
    [onSelect, onHideMenu]
  );

  const onCreateItem = React.useCallback(
    (...args) => {
      onCreate(...args);
      onHideMenu();
    },
    [onCreate, onHideMenu]
  );

  React.useEffect(() => {
    onUpdateOptionsToRender(optionLabel);
    updateSearchLabel(optionLabel);
  }, [optionLabel, onUpdateOptionsToRender]);

  React.useEffect(() => {
    open ? onOpenMenu() : onHideMenu();
  }, [open]);

  return (
    <Manager>
      <SelectWrapper
        tabIndex={searchable ? -1 : 0}
        onFocus={!searchable ? onOpenMenu : null}
        onClick={!searchable ? onOpenMenu : null}
        className={className}
      >
        <Reference innerRef={setInputRef}>
          {({ ref }) => (
            <SearchInput
              ref={ref}
              value={searchLabel}
              onFocus={searchable ? onOpenMenu : null}
              onClick={searchable ? onOpenMenu : null}
              disabled={disabled || !searchable}
              onChange={onChangeSearchLabel}
              isFocused={opened}
              autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
              searchable={searchable}
              placeholder={placeholder}
            />
          )}
        </Reference>
      </SelectWrapper>

      {opened && (
        <Menu
          onHide={onHideMenu}
          options={optionsToRender}
          onSelect={onSelectItem}
          inputRef={inputRef}
          onCreate={onCreateItem}
          autoWidth={autoWidth}
          creatable={creatable}
          placement={placement}
          searchLabel={searchLabel}
          onFocusOption={onFocusOption}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          isButtonDisabled={isButtonDisabled}
          popoverModifiers={menuPopoverModifiers}
          renderOptionLabel={renderOptionLabel}
          focusedOptionIndex={focusedOptionIndex}
          createInputPlaceholder={createInputPlaceholder}
        />
      )}
    </Manager>
  );
}
