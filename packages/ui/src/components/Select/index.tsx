import Flex from '@ui/components/Flex';
import Portal from '@ui/components/Portal';
import SearchInput, { SearchInputIcon } from '@ui/components/SearchInput';
import { toast } from '@ui/components/Toast';
import { useDidUpdateEffect, usePersistFunction } from '@ui/hooks';
import { Primitive } from '@ui/types';
import { setRef } from '@ui/utils';
import { Nullable, Utils } from '@voiceflow/common';
import noop from 'lodash/noop';
import React from 'react';
import { Manager, PopperProps, Reference } from 'react-popper';

// for some reason absolute paths are not transformed for this import
import {
  defaultMenuLabelRenderer,
  GetOptionLabel,
  GetOptionValue,
  isGroupedOptions,
  isUIOnlyMenuItemOption,
  MenuItemGrouped,
  MenuItemMultilevel,
  MenuItemWithID,
} from '../NestedMenu';
import NestedMenu from '../NestedMenu/Menu';
import { InlineInputValue, InputBadge, PrefixContainer, SelectWrapper, TagsContainer, TagsInput } from './components';
import { defaultOptionsFilter, searchableOptionsFilter } from './optionsFilters';
import {
  SelectClearableProps,
  SelectCreatableClearableProps,
  SelectCreatableProps,
  SelectCreatableWithIDClearableProps,
  SelectCreatableWithIDProps,
  SelectGroupedClearableProps,
  SelectGroupedProps,
  SelectGroupedValueWithIDClearableProps,
  SelectGroupedValueWithIDProps,
  SelectGroupedWithIDClearableProps,
  SelectGroupedWithIDProps,
  SelectInputVariant,
  SelectInternalProps,
  SelectMultilevelClearableProps,
  SelectMultilevelProps,
  SelectMultilevelValueWithIDClearableProps,
  SelectMultilevelValueWithIDProps,
  SelectMultilevelWithIDClearableProps,
  SelectMultilevelWithIDProps,
  SelectPrimitiveClearableProps,
  SelectPrimitiveCreatableClearableProps,
  SelectPrimitiveCreatableProps,
  SelectPrimitiveProps,
  SelectProps,
  SelectValueClearableProps,
  SelectValueCreatableClearableProps,
  SelectValueCreatableProps,
  SelectValueCreatableWithIDClearableProps,
  SelectValueCreatableWithIDProps,
  SelectValueGroupedClearableProps,
  SelectValueGroupedProps,
  SelectValueMultilevelClearableProps,
  SelectValueMultilevelProps,
  SelectValueProps,
  SelectValueWithIDClearableProps,
  SelectValueWithIDProps,
  SelectWithIDClearableProps,
  SelectWithIDProps,
} from './types';

export type { BaseSelectProps, FilterResult, OptionsFilter } from './types';
export { SelectInputVariant } from './types';

export { defaultOptionsFilter, searchableOptionsFilter };
export * from './components';

const defaultGetter = (option: unknown) => option;

function Select<Option extends Primitive>(props: SelectPrimitiveProps<Option>): React.ReactElement;
function Select<Option extends Primitive>(props: SelectPrimitiveClearableProps<Option>): React.ReactElement;
function Select<Option extends Primitive>(props: SelectPrimitiveCreatableProps<Option>): React.ReactElement;
function Select<Option extends Primitive>(props: SelectPrimitiveCreatableClearableProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID>(props: SelectWithIDProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID>(props: SelectWithIDClearableProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID>(props: SelectCreatableWithIDProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID>(props: SelectCreatableWithIDClearableProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID, Value>(props: SelectValueWithIDProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemWithID, Value>(props: SelectValueWithIDClearableProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemWithID, Value>(props: SelectValueCreatableWithIDProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemWithID, Value>(props: SelectValueCreatableWithIDClearableProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemGrouped<Option>>(props: SelectGroupedProps<Option>): React.ReactElement;
function Select<Option extends MenuItemGrouped<Option>>(props: SelectGroupedClearableProps<Option>): React.ReactElement;
function Select<Option extends MenuItemGrouped<Option>, Value>(props: SelectValueGroupedProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemGrouped<Option>, Value>(props: SelectValueGroupedClearableProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemMultilevel<Option>>(props: SelectMultilevelProps<Option>): React.ReactElement;
function Select<Option extends MenuItemMultilevel<Option>>(props: SelectMultilevelClearableProps<Option>): React.ReactElement;
function Select<Option extends MenuItemMultilevel<Option>, Value>(props: SelectValueMultilevelProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemMultilevel<Option>, Value>(props: SelectValueMultilevelClearableProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemWithID & MenuItemGrouped<Option>>(props: SelectGroupedWithIDProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID & MenuItemGrouped<Option>>(props: SelectGroupedWithIDClearableProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID & MenuItemGrouped<Option>, Value>(
  props: SelectGroupedValueWithIDProps<Option, Value>
): React.ReactElement;
function Select<Option extends MenuItemWithID & MenuItemGrouped<Option>, Value>(
  props: SelectGroupedValueWithIDClearableProps<Option, Value>
): React.ReactElement;
function Select<Option extends MenuItemWithID & MenuItemMultilevel<Option>>(props: SelectMultilevelWithIDProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID & MenuItemMultilevel<Option>>(props: SelectMultilevelWithIDClearableProps<Option>): React.ReactElement;
function Select<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value>(
  props: SelectMultilevelValueWithIDProps<Option, Value>
): React.ReactElement;
function Select<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value>(
  props: SelectMultilevelValueWithIDClearableProps<Option, Value>
): React.ReactElement;
function Select<Option>(props: SelectCreatableProps<Option>): React.ReactElement;
function Select<Option>(props: SelectCreatableClearableProps<Option>): React.ReactElement;
function Select<Option, Value>(props: SelectValueCreatableProps<Option, Value>): React.ReactElement;
function Select<Option, Value>(props: SelectValueCreatableClearableProps<Option, Value>): React.ReactElement;
function Select<Option>(props: SelectProps<Option>): React.ReactElement;
function Select<Option>(props: SelectClearableProps<Option>): React.ReactElement;
function Select<Option, Value>(props: SelectValueProps<Option, Value>): React.ReactElement;
function Select<Option, Value>(props: SelectValueClearableProps<Option, Value>): React.ReactElement;
// eslint-disable-next-line sonarjs/cognitive-complexity
function Select({
  id,
  open,
  icon,
  label = '',
  value,
  inline = false,
  onOpen,
  onBlur,
  prefix,
  onClose,
  grouped,
  options = [],
  minWidth = true,
  onSearch,
  disabled,
  onSelect,
  onCreate,
  iconProps,
  onKeyDown,
  placement = 'bottom-start',
  autoWidth = true,
  fullWidth,
  autoFocus,
  clearable = false,
  maxHeight,
  creatable,
  className,
  isDropdown = !!label,
  borderLess,
  searchable,
  renderTags,
  rightAction,
  onMouseDown,
  placeholder,
  createLabel,
  searchLabel: searchLabelProp = '',
  autoDismiss = true,
  displayName = undefined,
  renderEmpty,
  inputVariant = SelectInputVariant.DROPDOWN,
  renderAsSpan,
  minMenuWidth,
  isMultiLevel,
  inputStopProp = true,
  optionsFilter = searchable ? searchableOptionsFilter : defaultOptionsFilter,
  renderTrigger,
  getOptionValue = defaultGetter as GetOptionValue<unknown, unknown>,
  getOptionKey = (option, index) => String(getOptionValue(option) || index),
  getOptionLabel = defaultGetter as GetOptionLabel<unknown>,
  optionsMaxSize,
  validateCreate,
  labelSearchable = !label && searchable,
  selectedOptions,
  formatInputValue,
  alwaysShowCreate = false,
  inDropdownSearch = false,
  isButtonDisabled,
  renderOptionLabel = defaultMenuLabelRenderer,
  renderFooterAction,
  renderSearchSuffix,
  renderOptionsFilter,
  autoUpdatePlacement,
  showNotMatchedOptions,
  createInputPlaceholder,
}: SelectInternalProps): React.ReactElement {
  const optionLabel = searchLabelProp || String(getOptionLabel(value) ?? '') || '';

  const inputRef = React.useRef<HTMLInputElement>(null);
  const inlineRef = React.useRef<HTMLInputElement>(null);

  const [initialValueLabel] = React.useState(optionLabel);
  const [opened, updateOpened] = React.useState(!!open);
  const [directMatch, setDirectMatch] = React.useState(false);
  const [searchLabel, updateSearchLabel] = React.useState(optionLabel);
  const [optionsToRender, updateOptionsToRender] = React.useState(() => (renderOptionsFilter ? options.filter(renderOptionsFilter) : options));
  const [inputWrapperNode, setInputWrapperNode] = React.useState<Nullable<HTMLDivElement>>(null);
  const [focusedOptionIndex, updateFocusedOptionIndex] = React.useState(isMultiLevel ? null : 0);

  const dataRef = React.useRef({
    searchLabel,
    initialValueLabel,
    updatePopperPosition: noop,
  });

  dataRef.current.searchLabel = searchLabel;

  const renderDropdown = opened && (!!options.length || searchLabel || !searchable || !!renderEmpty);
  const isDropDownOpened = isDropdown && opened;
  const firstOptionIndex =
    ((!directMatch && ((isDropdown && searchable) || creatable)) || inDropdownSearch) && (alwaysShowCreate || !searchable || !!searchLabel) ? 1 : 0;

  const menuPopoverModifiers = React.useMemo<NonNullable<PopperProps['modifiers']>>(
    () => ({
      hide: { enabled: false },
      autoSizing: {
        enabled: true,
        fn: (data) => {
          if (placement === 'bottom-start' && inputWrapperNode) {
            // eslint-disable-next-line no-param-reassign
            data.styles.width = `${inputWrapperNode.getBoundingClientRect().width}px`;
          }

          return data;
        },
        order: 840,
      },
      preventOverflow: { enabled: false },
    }),
    [inputWrapperNode, placement]
  );

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onUpdateOptionsToRender = (label: string) => {
    const { matchedOptions } = optionsFilter(options, label, {
      grouped,
      maxSize: optionsMaxSize,
      isMultiLevel,
      getOptionLabel,
      getOptionValue,
      showNotMatched: showNotMatchedOptions,
    });

    let hasExactMatch = false;

    if (matchedOptions.length === 1 && !isUIOnlyMenuItemOption(matchedOptions[0])) {
      const optionLabel = getOptionLabel(getOptionValue(matchedOptions[0]));

      hasExactMatch = typeof optionLabel === 'string' && optionLabel.toLowerCase() === label.toLowerCase();
    }

    const initialLabelVal = dataRef.current.initialValueLabel;

    hasExactMatch = hasExactMatch || (!!initialLabelVal && initialLabelVal.toLowerCase() === label.toLowerCase());

    setDirectMatch(hasExactMatch);

    const findIndexCallback = (option: unknown) => !isUIOnlyMenuItemOption(option) && value === getOptionValue(option);

    let activeOptionIndex;

    if (isGroupedOptions(!!grouped, matchedOptions)) {
      activeOptionIndex = matchedOptions
        .flatMap((option) => (isUIOnlyMenuItemOption(option) ? option : option.options ?? []))
        .findIndex(findIndexCallback);
    } else {
      activeOptionIndex = matchedOptions.findIndex(findIndexCallback);
    }

    if (!isMultiLevel) {
      if (searchable) {
        updateFocusedOptionIndex(matchedOptions.length ? firstOptionIndex : 0);
      } else {
        updateFocusedOptionIndex(activeOptionIndex === -1 ? 0 : activeOptionIndex + firstOptionIndex);
      }
    }
    updateOptionsToRender(matchedOptions);
  };

  const onOpenMenu = usePersistFunction((event?: React.MouseEvent | React.FocusEvent) => {
    if (inputStopProp) {
      event?.stopPropagation();
    }

    if (searchable) {
      inputRef.current?.focus?.();
    }

    if (!opened) {
      updateOpened(true);
      onOpen?.();
    }

    dataRef.current.initialValueLabel = optionLabel;

    // Clear the search so all options render
    const hasExistingInputLabel = searchable && dataRef.current.initialValueLabel;

    if (hasExistingInputLabel) {
      dataRef.current.searchLabel = dataRef.current.initialValueLabel;

      onUpdateOptionsToRender('');
      setDirectMatch(true);
    } else {
      onUpdateOptionsToRender(dataRef.current.searchLabel);
    }
  });

  const onHideMenu = usePersistFunction(() => {
    if (searchable) {
      inputRef.current?.blur?.();
    }

    if (searchable && dataRef.current.searchLabel !== optionLabel) {
      updateSearchLabel(optionLabel);
    }

    if (isMultiLevel) {
      updateFocusedOptionIndex(null);
    }

    updateOpened(false);
    onClose?.();
  });

  const onFocusOption = usePersistFunction((index: number) => {
    let nextIndex = index;

    const flatOptions = isGroupedOptions(!!grouped, optionsToRender)
      ? optionsToRender.flatMap((option) => (isUIOnlyMenuItemOption(option) ? option : option.options ?? []))
      : optionsToRender;

    if (index < 0) {
      nextIndex = flatOptions.length - (1 - firstOptionIndex);
    } else if (index > flatOptions.length - (1 - firstOptionIndex)) {
      nextIndex = 0;
    }

    updateFocusedOptionIndex(nextIndex);
  });

  const handleOnSearchLabelChange = (val: string) => {
    onUpdateOptionsToRender(val);
    updateSearchLabel(val);
    onSearch?.(val);
  };

  const onChangeSearchLabel = ({ target }: React.ChangeEvent<HTMLInputElement>) =>
    handleOnSearchLabelChange(formatInputValue ? formatInputValue(target.value) : target.value);

  const onSelectItem = (value: unknown, optionsPath: number[], updatePopperPosition: () => void) => {
    onSelect(value, optionsPath);
    handleOnSearchLabelChange('');

    if (autoUpdatePlacement) {
      dataRef.current.updatePopperPosition = updatePopperPosition;
    }

    if (!autoDismiss) return;

    onHideMenu();
  };

  const onCreateItem = (label: string, updatePopperPosition: () => void) => {
    try {
      updateSearchLabel('');
      validateCreate?.(label);
      onCreate?.(label);

      if (autoUpdatePlacement) {
        dataRef.current.updatePopperPosition = updatePopperPosition;
      }

      if (autoDismiss) {
        onHideMenu();
      }
    } catch (error) {
      toast.warn(error?.message || error?.toString?.() || 'something went wrong');
    }
  };

  const onIconClick = () => {
    if (clearable) {
      onSelect(null, []);
    } else if (!disabled || !searchable) {
      onOpenMenu();
    }
  };

  React.useEffect(() => {
    if (renderOptionsFilter && selectedOptions) {
      updateOptionsToRender(options.filter(renderOptionsFilter));
    }

    if (autoUpdatePlacement) {
      dataRef.current.updatePopperPosition();
    }
  }, [selectedOptions]);

  React.useEffect(() => {
    onUpdateOptionsToRender(optionLabel);
    updateSearchLabel(optionLabel);
  }, [optionLabel, grouped]);

  React.useEffect(() => {
    if (inline && inputWrapperNode) {
      inputWrapperNode.style.width = `${inlineRef.current?.clientWidth}px`;
    }
  });

  useDidUpdateEffect(() => {
    if (open) {
      onOpenMenu();
    } else {
      onHideMenu();
    }
  }, [open]);

  const inputProps = {
    icon,
    inline,
    onBlur,
    opened,
    onFocus: searchable ? onOpenMenu : undefined,
    onClick: searchable ? onOpenMenu : undefined,
    disabled: disabled || !labelSearchable,
    onChange: onChangeSearchLabel,
    isFocused: opened,
    iconProps,
    fullWidth,
    autoFocus,
    onKeyDown,
    leftAction: prefix ? <PrefixContainer>{prefix}</PrefixContainer> : null,
    searchable: labelSearchable,
    isDropdown,
    borderLess,
    placeholder,
    onMouseDown: searchable ? onMouseDown : undefined,
    rightAction,
    isDropDownOpened,
  };

  const hasOptions = !!selectedOptions?.length;

  return (
    <Manager>
      <Reference innerRef={setInputWrapperNode}>
        {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
        {({ ref }) => (
          <SelectWrapper
            as={renderAsSpan ? 'span' : undefined}
            ref={ref}
            onFocus={!labelSearchable ? onOpenMenu : undefined}
            onClick={!labelSearchable ? onOpenMenu : undefined}
            tabIndex={labelSearchable ? -1 : 0}
            minWidth={minWidth}
            isFocused={opened}
            className={className}
            fullWidth={fullWidth}
            clearable={clearable}
            onMouseDown={!labelSearchable ? onMouseDown : undefined}
          >
            {renderTrigger ? (
              renderTrigger({ ...inputProps, ref: inputRef, value: searchLabel, isOpen: opened, onOpenMenu, onHideMenu })
            ) : (
              <Flex>
                <>
                  {inputVariant === SelectInputVariant.TAGS && renderTags && (
                    <TagsContainer
                      onClick={Utils.functional.chainVoid(onOpenMenu, () => inputRef.current?.focus())}
                      hasTags={hasOptions}
                      isActive={opened}
                    >
                      {renderTags()}

                      <TagsInput
                        value={label || searchLabel}
                        onBlur={Utils.functional.chain<[React.FocusEvent<HTMLElement>]>(() => !renderDropdown && updateOpened(false), onBlur)}
                        hastags={hasOptions}
                        onClick={searchable ? onOpenMenu : undefined}
                        onChange={onChangeSearchLabel}
                        inputRef={(node) => setRef(inputRef, node)}
                        placeholder={placeholder}
                        autoComplete="off"
                      />
                    </TagsContainer>
                  )}

                  {inputVariant === SelectInputVariant.DROPDOWN && (
                    <>
                      <SearchInput
                        {...inputProps}
                        ref={inputRef}
                        type="search"
                        value={label || searchLabel}
                        clearable={clearable}
                        autoComplete="off"
                      />

                      <SearchInputIcon
                        icon={clearable ? 'close' : 'caretDown'}
                        size={clearable ? 14 : 10}
                        color={isDropDownOpened ? '#5D9DF5' : '#6e849a'}
                        onClick={onIconClick}
                      />
                    </>
                  )}

                  {inputVariant === SelectInputVariant.COUNTER && (
                    <>
                      <SearchInput
                        {...inputProps}
                        ref={inputRef}
                        type="search"
                        value={hasOptions ? displayName : ''}
                        ellipsis
                        onChange={() => null}
                        autoComplete="off"
                      />

                      {hasOptions ? (
                        <InputBadge>{selectedOptions.length}</InputBadge>
                      ) : (
                        <SearchInputIcon icon="caretDown" color={isDropDownOpened ? '#5D9DF5' : '#6e849a'} size={10} onClick={onIconClick} />
                      )}
                    </>
                  )}
                </>
              </Flex>
            )}
          </SelectWrapper>
        )}
      </Reference>

      {inline && (
        <Portal>
          <InlineInputValue ref={inlineRef}>{label || searchLabel || placeholder}</InlineInputValue>
        </Portal>
      )}

      {renderDropdown && (
        <NestedMenu
          id={id}
          onHide={onHideMenu}
          grouped={grouped}
          options={optionsToRender}
          onSelect={onSelectItem}
          onCreate={onCreateItem}
          minWidth={minMenuWidth}
          maxHeight={maxHeight}
          autoWidth={autoWidth}
          creatable={creatable}
          placement={placement}
          searchable={searchable}
          isDropdown={isDropdown}
          createLabel={createLabel}
          searchLabel={searchLabel}
          renderEmpty={renderEmpty}
          isMultiLevel={isMultiLevel}
          getOptionKey={getOptionKey}
          onFocusOption={onFocusOption}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          inputWrapperNode={inputWrapperNode}
          formatInputValue={formatInputValue}
          firstOptionIndex={firstOptionIndex}
          isButtonDisabled={isButtonDisabled}
          popoverModifiers={menuPopoverModifiers}
          inDropdownSearch={inDropdownSearch}
          alwaysShowCreate={alwaysShowCreate}
          directSearchMatch={directMatch}
          renderOptionLabel={renderOptionLabel}
          focusedOptionIndex={focusedOptionIndex}
          renderSearchSuffix={renderSearchSuffix}
          renderFooterAction={renderFooterAction}
          onChangeSearchLabel={onChangeSearchLabel}
          createInputPlaceholder={createInputPlaceholder}
        />
      )}
    </Manager>
  );
}

export default Select;
