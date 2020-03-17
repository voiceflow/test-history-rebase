import React from 'react';
import { Manager, Reference } from 'react-popper';

import Flex from '@/components/Flex';
import Portal from '@/components/Portal';

import { InlineInputValue, Menu, SearchInput, SearchInputIcon, SelectWrapper } from './components';
import defaultLabelRenderer from './defaultLabelRenderer';
import { defaultOptionsFilter, searchableOptionsFilter } from './optionsFilters';

const defaultGetter = (option) => option;

export { defaultOptionsFilter, searchableOptionsFilter, defaultLabelRenderer };

export default function Select({
  open,
  label = '',
  value,
  inline = false,
  onBlur,
  onOpen,
  onClose,
  grouped,
  options,
  minWidth = true,
  disabled,
  onSelect,
  withIcon = false,
  onCreate,
  placement = 'bottom-start',
  autoWidth = true,
  fullWidth,
  autoFocus,
  maxHeight,
  creatable,
  className,
  borderLess,
  searchable,
  wrapperTag,
  formatValue,
  placeholder,
  optionsFilter = searchable ? searchableOptionsFilter : defaultOptionsFilter,
  getOptionValue = defaultGetter,
  getOptionKey = getOptionValue,
  getOptionLabel = defaultGetter,
  optionsMaxSize,
  triggerRenderer,
  isButtonDisabled,
  renderOptionLabel = defaultLabelRenderer,
  multiLevelDropdown,
  showNotMatchedOptions,
  createInputPlaceholder,
  rightAction,
  clearable = false,
}) {
  const optionLabel = getOptionLabel(value) || '';

  const cachedRef = React.useRef({});

  const inputRef = React.useRef(null);
  const inlineRef = React.useRef(null);
  const [opened, updateOpened] = React.useState(open);
  const [searchLabel, updateSearchLabel] = React.useState(optionLabel);
  const [optionsToRender, updateOptionsToRender] = React.useState(options);
  const [inputWrapperRef, setInputWrapperRef] = React.useState(null);
  const [focusedOptionIndex, updateFocusedOptionIndex] = React.useState(multiLevelDropdown ? null : 0);

  const menuSearchable = !!label && searchable;
  const labelSearchable = !label && searchable;
  const isDropDownOpened = !!label && opened;

  cachedRef.current = {
    ...cachedRef.current,
    value,
    opened,
    onOpen,
    onClose,
    options,
    grouped,
    creatable,
    searchable,
    optionLabel,
    searchLabel,
    optionsFilter,
    getOptionLabel,
    optionsMaxSize,
    getOptionValue,
    inputWrapperRef,
    firstOptionIndex: menuSearchable || creatable ? 1 : 0,
    multiLevelDropdown,
    showNotMatchedOptions,
  };

  const menuPopoverModifiers = React.useMemo(() => {
    const onComputedStyle = (data) => {
      if (placement === 'bottom-start') {
        data.styles.width = inputWrapperRef && inputWrapperRef.getBoundingClientRect().width;
      }

      return data;
    };

    return { autoSizing: { enabled: true, fn: onComputedStyle, order: 840 }, preventOverflow: { enabled: false }, hide: { enabled: false } };
  }, [inputWrapperRef, placement]);

  const onUpdateOptionsToRender = React.useCallback(
    (label) => {
      const { filteredOptions, matchedOptions } = cachedRef.current.optionsFilter(cachedRef.current.options, label, {
        grouped: cachedRef.current.grouped,
        maxSize: cachedRef.current.optionsMaxSize,
        showNotMatched: cachedRef.current.showNotMatchedOptions,
        getOptionLabel: cachedRef.current.getOptionLabel,
        getOptionValue: cachedRef.current.getOptionValue,
        multiLevelDropdown: cachedRef.current.multiLevelDropdown,
      });

      const findIndex = (option) => cachedRef.current.value === cachedRef.current.getOptionValue(option);

      let activeOptionIndex;
      if (grouped) {
        activeOptionIndex = matchedOptions.flatMap((option) => option.options).findIndex(findIndex);
      } else {
        activeOptionIndex = matchedOptions.findIndex(findIndex);
      }

      if (!cachedRef.current.multiLevelDropdown) {
        if (cachedRef.current.searchable) {
          updateFocusedOptionIndex(matchedOptions.length ? cachedRef.current.firstOptionIndex : 0);
        } else {
          updateFocusedOptionIndex(activeOptionIndex === -1 ? 0 : activeOptionIndex + cachedRef.current.firstOptionIndex);
        }
      }

      updateOptionsToRender(filteredOptions);
    },
    [grouped, updateOptionsToRender, updateFocusedOptionIndex]
  );

  const onOpenMenu = React.useCallback(
    (e) => {
      e?.stopPropagation();
      inputRef.current?.focus?.();

      if (!cachedRef.current.opened) {
        updateOpened(true);
        onUpdateOptionsToRender(cachedRef.current.searchLabel);
        cachedRef.current.onOpen?.();
      }
    },
    [updateOpened, onUpdateOptionsToRender]
  );

  const onHideMenu = React.useCallback(() => {
    inputRef.current?.blur?.();

    if (cachedRef.current.searchable && cachedRef.current.searchLabel !== cachedRef.current.optionLabel) {
      updateSearchLabel(cachedRef.current.optionLabel);
    }

    if (cachedRef.current.multiLevelDropdown) {
      updateFocusedOptionIndex(null);
    }

    updateOpened(false);
    cachedRef.current.onClose?.();
  }, [updateOpened, updateSearchLabel]);

  const onFocusOption = React.useCallback(
    (index) => {
      let nextIndex = index;
      const flatOptions = grouped ? optionsToRender.flatMap((option) => option.options) : optionsToRender;

      if (index < 0) {
        nextIndex = flatOptions.length - (1 - cachedRef.current.firstOptionIndex);
      } else if (index > flatOptions.length - (1 - cachedRef.current.firstOptionIndex)) {
        nextIndex = 0;
      }

      updateFocusedOptionIndex(nextIndex);
    },
    [grouped, optionsToRender, updateFocusedOptionIndex]
  );

  const onChangeSearchLabel = React.useCallback(
    ({ target }) => {
      const input = formatValue ? formatValue(target.value) : target.value;
      onUpdateOptionsToRender(input);
      updateSearchLabel(input);
    },
    [onUpdateOptionsToRender]
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
  }, [onHideMenu, onOpenMenu, open]);

  const onIconClick = React.useCallback(() => {
    if (clearable) {
      onSelect(null);
    } else {
      onOpenMenu();
    }
  }, [clearable, onOpenMenu, onSelect]);

  const inputProps = {
    inline,
    onBlur,
    onFocus: searchable ? onOpenMenu : null,
    onClick: searchable ? onOpenMenu : null,
    disabled: disabled || !labelSearchable,
    withIcon,
    onChange: onChangeSearchLabel,
    isFocused: opened,
    fullWidth,
    autoFocus,
    searchable: labelSearchable,
    isDropdown: !!label,
    borderLess,
    placeholder,
    isDropDownOpened,
    rightAction,
  };

  React.useEffect(() => {
    if (inline && inputWrapperRef) {
      inputWrapperRef.style.width = `${inlineRef.current?.clientWidth}px`;
    }
  });

  return (
    <Manager>
      <Reference innerRef={setInputWrapperRef}>
        {({ ref }) => (
          <SelectWrapper
            as={wrapperTag}
            ref={ref}
            onFocus={!labelSearchable ? onOpenMenu : null}
            onClick={!labelSearchable ? onOpenMenu : null}
            tabIndex={labelSearchable ? -1 : 0}
            minWidth={minWidth}
            isFocused={opened}
            className={className}
            fullWidth={fullWidth}
            clearable={clearable}
          >
            {triggerRenderer ? (
              triggerRenderer({ ...inputProps, value: searchLabel, ref: inputRef })
            ) : (
              <Flex>
                <SearchInput {...inputProps} value={label || searchLabel} ref={inputRef} type="search" autoComplete="off" clearable={clearable} />

                {!withIcon && (
                  <SearchInputIcon
                    icon={clearable ? 'close' : 'caretDown'}
                    color={isDropDownOpened ? '#5D9DF5' : '#6e849a'}
                    size={10}
                    onClick={onIconClick}
                  />
                )}
              </Flex>
            )}
          </SelectWrapper>
        )}
      </Reference>

      {inline && (
        <Portal>
          <InlineInputValue ref={inlineRef}>{searchLabel || placeholder}</InlineInputValue>
        </Portal>
      )}

      {opened && (
        <Menu
          onHide={onHideMenu}
          grouped={grouped}
          options={optionsToRender}
          onSelect={onSelectItem}
          onCreate={onCreateItem}
          maxHeight={maxHeight}
          autoWidth={autoWidth}
          creatable={creatable}
          placement={placement}
          formatValue={formatValue}
          searchLabel={searchLabel}
          getOptionKey={getOptionKey}
          onFocusOption={onFocusOption}
          menuSearchable={menuSearchable}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          inputWrapperRef={inputWrapperRef}
          firstOptionIndex={cachedRef.current.firstOptionIndex}
          isButtonDisabled={isButtonDisabled}
          popoverModifiers={menuPopoverModifiers}
          renderOptionLabel={renderOptionLabel}
          multiLevelDropdown={multiLevelDropdown}
          focusedOptionIndex={focusedOptionIndex}
          onChangeSearchLabel={onChangeSearchLabel}
          createInputPlaceholder={createInputPlaceholder}
        />
      )}
    </Manager>
  );
}
