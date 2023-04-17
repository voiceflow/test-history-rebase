import Flex from '@ui/components/Flex';
import Portal from '@ui/components/Portal';
import SearchInput, { SearchInputIcon } from '@ui/components/SearchInput';
import { toast } from '@ui/components/Toast';
import { useDidUpdateEffect, usePersistFunction } from '@ui/hooks';
import { ClassName } from '@ui/styles/constants';
import * as System from '@ui/system';
import { Primitive } from '@ui/types';
import { setRef, stopPropagation } from '@ui/utils';
import { Nullable, Utils } from '@voiceflow/common';
import cn from 'classnames';
import noop from 'lodash/noop';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';
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
import { InlineInputValue, InputBadge, LeftActionContainer, PrefixContainer, SelectWrapper, TagsContainer, TagsInput } from './components';
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

function Select<Option, GroupOption extends MenuItemGrouped<Option>>(props: SelectGroupedProps<Option, GroupOption>): React.ReactElement;
function Select<Option, GroupOption extends MenuItemGrouped<Option>>(props: SelectGroupedClearableProps<Option, GroupOption>): React.ReactElement;
function Select<Option, GroupOption extends MenuItemGrouped<Option>, Value>(
  props: SelectValueGroupedProps<Option, GroupOption, Value>
): React.ReactElement;
function Select<Option, GroupOption extends MenuItemGrouped<Option>, Value>(
  props: SelectValueGroupedClearableProps<Option, GroupOption, Value>
): React.ReactElement;
function Select<Option extends MenuItemWithID, GroupOption extends MenuItemGrouped<Option>>(
  props: SelectGroupedWithIDProps<Option, GroupOption>
): React.ReactElement;
function Select<Option extends MenuItemWithID, GroupOption extends MenuItemGrouped<Option>>(
  props: SelectGroupedWithIDClearableProps<Option, GroupOption>
): React.ReactElement;
function Select<Option extends MenuItemWithID, GroupOption extends MenuItemGrouped<Option>, Value>(
  props: SelectGroupedValueWithIDProps<Option, GroupOption, Value>
): React.ReactElement;
function Select<Option extends MenuItemWithID, GroupOption extends MenuItemGrouped<Option>, Value>(
  props: SelectGroupedValueWithIDClearableProps<Option, GroupOption, Value>
): React.ReactElement;
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
function Select<Option extends MenuItemMultilevel<Option>>(props: SelectMultilevelProps<Option>): React.ReactElement;
function Select<Option extends MenuItemMultilevel<Option>>(props: SelectMultilevelClearableProps<Option>): React.ReactElement;
function Select<Option extends MenuItemMultilevel<Option>, Value>(props: SelectValueMultilevelProps<Option, Value>): React.ReactElement;
function Select<Option extends MenuItemMultilevel<Option>, Value>(props: SelectValueMultilevelClearableProps<Option, Value>): React.ReactElement;
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
  error = false,
  value,
  inline = false,
  onOpen,
  onBlur,
  prefix,
  onClose,
  grouped,
  options = [],
  minWidth = true,
  maxWidth,
  onSearch,
  disabled,
  onSelect,
  onCreate,
  useLayers = false,
  iconProps,
  onKeyDown,
  modifiers,
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
  leftAction,
  noOverflow,
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
  maxMenuWidth,
  isMultiLevel,
  inputStopProp = true,
  optionsFilter = searchable ? searchableOptionsFilter : defaultOptionsFilter,
  renderTrigger,
  getOptionValue = defaultGetter as GetOptionValue<unknown, unknown>,
  getOptionKey = (option, index) => String(getOptionValue(option) || index),
  autoInputWidth,
  getOptionLabel = defaultGetter as GetOptionLabel<unknown>,
  optionsMaxSize,
  validateCreate,
  labelSearchable = !label && searchable,
  selectedOptions,
  nestedModifiers,
  formatInputValue,
  isSecondaryInput,
  isSecondaryIcon,
  alwaysShowCreate = false,
  inDropdownSearch = false,
  isButtonDisabled,
  renderOptionLabel = defaultMenuLabelRenderer,
  renderFooterAction,
  renderSearchSuffix,
  renderOptionsFilter,
  showSearchInputIcon = true,
  syncOptionsOnRender,
  nestedMenuAutoWidth = true,
  autoUpdatePlacement,
  clearOnSelectActive,
  showNotMatchedOptions,
  createInputPlaceholder,
  showDropdownColorOnActive = false,
  width,
}: SelectInternalProps): React.ReactElement {
  const withClearIcon = clearable && !clearOnSelectActive;
  const optionLabel = isDropdown && searchable && inDropdownSearch ? '' : searchLabelProp || String(getOptionLabel(value) ?? '') || '';

  const inputRef = React.useRef<HTMLInputElement>(null);
  const inlineRef = React.useRef<HTMLInputElement>(null);
  const menuContainerRef = React.useRef<HTMLDivElement>(null);

  const [initialValueLabel] = React.useState(optionLabel);
  const [opened, toggleOpen, forceClose] = useDismissable(!!open, { disableLayers: !useLayers });
  const [directMatch, setDirectMatch] = React.useState(false);
  const [searchLabel, setSearchLabel] = React.useState(isDropdown && searchable && inDropdownSearch ? '' : optionLabel);
  const [optionsToRender, setOptionsToRender] = React.useState(() => (renderOptionsFilter ? options.filter(renderOptionsFilter) : options));
  const [inputWrapperNode, setInputWrapperNode] = React.useState<Nullable<HTMLDivElement>>(null);
  const [focusedOptionIndex, setFocusedOptionIndex] = React.useState<Nullable<number>>(null);

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

  const menuPopoverModifiers: NonNullable<PopperProps['modifiers']> = {
    hide: { enabled: false },
    autoSizing: {
      enabled: true,
      fn: (data) => {
        if (placement === 'bottom-start' && inputWrapperNode && (data.instance.options.modifiers?.isRoot?.value || nestedMenuAutoWidth)) {
          // eslint-disable-next-line no-param-reassign
          data.styles.width = `${inputWrapperNode.getBoundingClientRect().width}px`;
        }

        return data;
      },
      order: 840,
    },
    preventOverflow: { enabled: false },
    ...modifiers,
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onUpdateOptionsToRender = (label: string, { skipIndexReset }: { skipIndexReset?: boolean } = {}) => {
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

    if (!skipIndexReset && !isMultiLevel) {
      if (searchable && inDropdownSearch) {
        setFocusedOptionIndex(!alwaysShowCreate && matchedOptions.length ? firstOptionIndex : 0);
      } else {
        setFocusedOptionIndex(activeOptionIndex === -1 ? null : activeOptionIndex + firstOptionIndex);
      }
    }

    setOptionsToRender(matchedOptions);
  };

  const onOpenMenu = usePersistFunction((event?: React.MouseEvent | React.FocusEvent) => {
    if (inputStopProp) {
      event?.stopPropagation();
    }

    if (searchable && !inDropdownSearch) {
      inputRef.current?.focus?.();
    }

    if (!opened) {
      toggleOpen();
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
      setSearchLabel(optionLabel);
    }

    if (isMultiLevel) {
      setFocusedOptionIndex(null);
    }

    forceClose();
    onClose?.();
  });

  const handleOnSearchLabelChange = (val: string, { isSelectEvent }: { isSelectEvent?: boolean } = {}) => {
    dataRef.current.searchLabel = val;
    onUpdateOptionsToRender(val, { skipIndexReset: isSelectEvent && inputVariant !== SelectInputVariant.DROPDOWN });
    setSearchLabel(val);
    onSearch?.(val);
  };

  const onChangeSearchLabel = ({ target }: React.ChangeEvent<HTMLInputElement>) =>
    handleOnSearchLabelChange(formatInputValue ? formatInputValue(target.value) : target.value);

  const onSelectItem = (newValue: unknown, optionsPath: number[], updatePopperPosition: () => void) => {
    if (clearable && clearOnSelectActive && newValue === value) {
      onSelect(null, []);
    } else {
      onSelect(newValue, optionsPath);
    }

    if (inputVariant !== SelectInputVariant.DROPDOWN || searchable) {
      handleOnSearchLabelChange('', { isSelectEvent: true });
    }

    if (autoUpdatePlacement) {
      dataRef.current.updatePopperPosition = updatePopperPosition;
    }

    if (!autoDismiss) return;

    onHideMenu();
  };

  const onCreateItem = (label: string, updatePopperPosition: () => void) => {
    try {
      setSearchLabel('');
      validateCreate?.(label);
      onCreate?.(label);

      if (autoUpdatePlacement) {
        dataRef.current.updatePopperPosition = updatePopperPosition;
      }

      if (autoDismiss) {
        onHideMenu();
      }
    } catch (error) {
      toast.warn(error instanceof Error ? error.message || JSON.stringify(error) : 'something went wrong');
    }
  };

  const onIconClick = () => {
    if (withClearIcon) {
      onSelect(null, []);
    } else if (!disabled || !searchable) {
      onOpenMenu();
    }
  };

  React.useEffect(() => {
    if (renderOptionsFilter && selectedOptions) {
      setOptionsToRender(options.filter(renderOptionsFilter));
    }

    if (autoUpdatePlacement) {
      dataRef.current.updatePopperPosition();
    }
  }, [selectedOptions]);

  React.useEffect(() => {
    onUpdateOptionsToRender(optionLabel);
    setSearchLabel(optionLabel);
  }, [optionLabel, grouped]);

  React.useLayoutEffect(() => {
    if ((inline || autoInputWidth) && inputWrapperNode && inlineRef.current) {
      inputWrapperNode.style.width = `${inlineRef.current.clientWidth}px`;
    }
  });

  useDidUpdateEffect(() => {
    if (open) {
      onOpenMenu();
    } else {
      onHideMenu();
    }
  }, [open]);

  useDidUpdateEffect(() => {
    if (syncOptionsOnRender) {
      setOptionsToRender(renderOptionsFilter ? options.filter(renderOptionsFilter) : options);
    }
  }, [options, syncOptionsOnRender, renderOptionsFilter]);

  const inputProps = {
    icon,
    error,
    inline,
    onBlur,
    opened,
    isEmpty: !optionsToRender.length,
    onFocus: searchable ? onOpenMenu : undefined,
    onClick: searchable ? onOpenMenu : undefined,
    disabled,
    readOnly: !labelSearchable,
    onChange: onChangeSearchLabel,
    isFocused: opened,
    iconProps,
    fullWidth,
    autoFocus,
    onKeyDown,
    noOverflow,
    leftAction: prefix ? <PrefixContainer>{prefix}</PrefixContainer> : null,
    searchable: labelSearchable,
    isDropdown,
    borderLess,
    placeholder,
    rightAction,
    onMouseDown: searchable ? onMouseDown : undefined,
    isSecondary: isSecondaryInput,
    isDropDownOpened,
  };

  const hasOptions = !!selectedOptions?.length;

  const caretIcon = isSecondaryInput || isSecondaryIcon ? 'arrowRightSmall' : 'caretDown';
  const caretIconSize = isSecondaryInput ? 9 : 8;

  return (
    <Manager>
      <Reference innerRef={setInputWrapperNode}>
        {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
        {({ ref }) => (
          <SelectWrapper
            id={id}
            as={renderAsSpan ? 'span' : undefined}
            ref={ref}
            width={width}
            onClick={!disabled && !labelSearchable ? onOpenMenu : undefined}
            tabIndex={labelSearchable || disabled ? -1 : 0}
            minWidth={minWidth}
            maxWidth={maxWidth}
            isFocused={opened}
            className={cn(className, ClassName.SELECT)}
            fullWidth={fullWidth}
            onMouseDown={!disabled && !labelSearchable ? onMouseDown : undefined}
            withClearIcon={withClearIcon}
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
                        value={isDropdown ? label : searchLabel}
                        onBlur={Utils.functional.chain<[React.FocusEvent<HTMLElement>]>(!renderDropdown ? forceClose : null, onBlur)}
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
                      {!!leftAction && (
                        <LeftActionContainer>
                          <System.IconButton.Base
                            icon={leftAction.icon}
                            active={leftAction.isActive}
                            onClick={stopPropagation(leftAction.onClick)}
                            disabled={leftAction.disabled}
                            iconProps={leftAction.iconProps}
                            hoverBackground={false}
                            activeBackground={false}
                          />
                        </LeftActionContainer>
                      )}

                      <SearchInput
                        {...inputProps}
                        ref={inputRef}
                        type="search"
                        error={error}
                        value={isDropdown ? label : searchLabel}
                        color={showDropdownColorOnActive && opened ? '#4a88de' : undefined}
                        autoComplete="off"
                        withLeftIcon={!!leftAction}
                        withRightIcon={showSearchInputIcon}
                        withClearIcon={withClearIcon}
                      />

                      {showSearchInputIcon && (
                        <SearchInputIcon
                          icon={withClearIcon ? 'close' : caretIcon}
                          size={withClearIcon ? 14 : caretIconSize}
                          color={showDropdownColorOnActive && opened ? '#4a88de' : '#6e849a'}
                          rotateEnabled={!withClearIcon && (isSecondaryInput || isSecondaryIcon)}
                          onClick={onIconClick}
                          $secondaryDisabled={isSecondaryInput && disabled}
                        />
                      )}
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
                        <SearchInputIcon icon={caretIcon} color="#6e849a" size={8} onClick={onIconClick} />
                      )}
                    </>
                  )}

                  {inputVariant === SelectInputVariant.SELECTED && (
                    <>
                      <SearchInput
                        {...inputProps}
                        ref={inputRef}
                        type="search"
                        value={
                          selectedOptions &&
                          selectedOptions
                            .map((option) => option && getOptionLabel(option))
                            .filter(Boolean)
                            .join(', ')
                        }
                        ellipsis
                        onChange={() => null}
                        autoComplete="off"
                      />

                      <SearchInputIcon icon={caretIcon} color="#6e849a" size={8} onClick={onIconClick} />
                    </>
                  )}
                </>
              </Flex>
            )}
          </SelectWrapper>
        )}
      </Reference>

      {(inline || autoInputWidth) && (
        <Portal>
          <InlineInputValue ref={inlineRef} withoutIcon={!showSearchInputIcon} isSecondary={isSecondaryInput}>
            {inputProps.leftAction}
            {isDropdown ? label : searchLabel || placeholder}
          </InlineInputValue>
        </Portal>
      )}

      {renderDropdown && (
        <NestedMenu
          id={id ? `${id}__nested-menu` : undefined}
          onHide={onHideMenu}
          grouped={grouped}
          options={optionsToRender}
          onSelect={onSelectItem}
          onCreate={onCreateItem}
          minWidth={minMenuWidth}
          maxWidth={maxMenuWidth}
          maxHeight={maxHeight}
          autoWidth={autoWidth}
          creatable={creatable}
          placement={placement}
          searchable={searchable}
          isDropdown={isDropdown}
          createLabel={createLabel}
          searchLabel={searchLabel}
          renderEmpty={renderEmpty}
          containerRef={menuContainerRef}
          isMultiLevel={isMultiLevel}
          getOptionKey={getOptionKey}
          onFocusOption={setFocusedOptionIndex}
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
          nestedPopoverModifiers={nestedModifiers}
          createInputPlaceholder={createInputPlaceholder}
        />
      )}
    </Manager>
  );
}

export default Object.assign(Select, { SearchInput });
