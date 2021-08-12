import noop from 'lodash/noop';
import React from 'react';
import AutosizeInput from 'react-input-autosize';
import { Manager, PopperProps, Reference } from 'react-popper';

import { useCache, useDidUpdateEffect } from '../../hooks';
import { Nullable } from '../../types';
import Flex from '../Flex';
import { AdvancedMenu, defaultMenuLabelRenderer } from '../NestedMenu';
import Portal from '../Portal';
import SearchInput, { SearchInputIcon } from '../SearchInput';
import { Icon, SvgIconProps } from '../SvgIcon';
import { toast } from '../Toast';
import { InlineInputValue, PrefixContainer, SelectWrapper, TagsContainer, TagsInput } from './components';
import { defaultOptionsFilter, searchableOptionsFilter } from './optionsFilters';

export { defaultOptionsFilter, searchableOptionsFilter };
export * from './components';

export type GetOptionLabel<V> = (value?: V) => string | undefined | null;

export type GetOptionValue<O, V> = (option?: O) => V | undefined;

export type GroupedOption<O> = O & { options?: O[] };

export type MultiLevelOption<O> = O & { options?: MultiLevelOption<O>[] };

export type RenderOptionLabel<O, V> = (
  option: O,
  searchLabel: string,
  getOptionLabel: GetOptionLabel<V>,
  getOptionValue: GetOptionValue<O, V>,
  config: { isFocused: boolean; optionsPath: number[] }
) => React.ReactNode;

export type OptionsFilter<O, V> = (
  options: O[],
  searchLabel: string,
  config: {
    grouped?: boolean;
    maxSize?: number;
    showNotMatched?: boolean;
    getOptionLabel: GetOptionLabel<V>;
    getOptionValue: GetOptionValue<O, V>;
    multiLevelDropdown?: boolean;
  }
) => { filteredOptions: O[]; matchedOptions: O[]; notMatchedOptions: O[] };

export type SelectProps<O, V> = {
  id?: string;
  tags?: any;
  footerAction?: boolean;
  footerActionLabel?: string;
  onClickFooterAction?: () => void;
  onSearch?: (val: string) => void;
  hasRadioButtons?: boolean;
  isSelectedFunc?: (id: string) => boolean;
  icon?: Icon;
  open?: boolean;
  inputStopProp?: boolean;
  label?: string;
  value?: V;
  inline?: boolean;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onOpen?: () => void;
  prefix?: React.ReactNode;
  selectedOptions?: any;
  options: O[];
  onClose?: () => void;
  createLabel?: string;
  grouped?: boolean;
  minWidth?: boolean;
  renderOptionsFilter?: (option: O) => boolean;
  onSelect: (value: V, optionsPath: number[]) => void;
  disabled?: boolean;
  placement?: PopperProps['placement'];
  autoWidth?: boolean;
  fullWidth?: boolean;
  clearable?: boolean | never;
  autoFocus?: boolean;
  maxHeight?: number | string;
  className?: string;
  iconProps?: Partial<SvgIconProps>;
  borderLess?: boolean;
  searchable?: boolean;
  rightAction?: React.ReactNode;
  placeholder?: string;
  onMouseDown?: React.MouseEventHandler;
  renderAsSpan?: boolean;
  getOptionKey?: (option: O) => string;
  optionsFilter?: OptionsFilter<O, V>;
  getOptionValue?: GetOptionValue<O, V>;
  getOptionLabel?: GetOptionLabel<V>;
  withSearchIcon?: boolean;
  optionsMaxSize?: number;
  alwaysShowCreate?: boolean;
  autoUpdatePlacement?: boolean;
  autoDismiss?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  triggerRenderer?: (options: {
    ref: React.RefObject<HTMLInputElement>;
    value: string;
    isOpen: boolean;
    inline: boolean;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    opened: boolean;
    onFocus?: (e?: React.FocusEvent) => void;
    onClick?: (e?: React.MouseEvent) => void;
    disabled?: boolean;
    onChange: React.ChangeEventHandler;
    isFocused: boolean;
    fullWidth?: boolean;
    autoFocus?: boolean;
    leftAction?: React.ReactNode;
    searchable?: boolean;
    isDropdown: boolean;
    borderLess?: boolean;
    placeholder?: string;
    rightAction?: React.ReactNode;
    isDropDownOpened: boolean;
  }) => React.ReactNode;
  isButtonDisabled?: (searchLabel: string) => boolean;
  formatInputValue?: (value: string) => string;
  renderOptionLabel?: RenderOptionLabel<O, V>;
  multiLevelDropdown?: boolean;
  showNotMatchedOptions?: boolean;
  createInputPlaceholder?: string;
  validateCreate?: (val: string) => boolean;
} & (
  | {
      creatable: true;
      onCreate: (label: string) => void;
    }
  | {
      creatable?: false | never;
      onCreate?: (label: string) => void;
    }
);

const defaultGetter = (option: unknown) => option;

const AnyAdvancedMenu = AdvancedMenu as React.FC<any>;

const Select = <O, V = O>({
  id,
  open,
  icon,
  inputStopProp = true,
  label = '',
  value,
  inline = false,
  onBlur,
  onKeyDown,
  footerAction,
  footerActionLabel,
  onSearch,
  createLabel,
  onClickFooterAction,
  onOpen,
  prefix,
  onClose,
  alwaysShowCreate = false,
  grouped,
  selectedOptions,
  options = [],
  renderOptionsFilter,
  minWidth = true,
  disabled,
  onSelect,
  onCreate,
  iconProps,
  autoDismiss = true,
  autoUpdatePlacement,
  placement = 'bottom-start',
  autoWidth = true,
  fullWidth,
  autoFocus,
  clearable = false,
  maxHeight,
  creatable,
  className,
  borderLess,
  searchable,
  rightAction,
  onMouseDown,
  placeholder,
  getOptionValue = defaultGetter as GetOptionValue<O, V>,
  getOptionKey = getOptionValue as any as (option: O) => string,
  renderAsSpan,
  optionsFilter = searchable ? searchableOptionsFilter : defaultOptionsFilter,
  getOptionLabel = defaultGetter as GetOptionLabel<V>,
  withSearchIcon,
  optionsMaxSize,
  triggerRenderer,
  formatInputValue,
  isButtonDisabled,
  renderOptionLabel = defaultMenuLabelRenderer,
  multiLevelDropdown,
  showNotMatchedOptions,
  createInputPlaceholder,
  validateCreate,
  tags,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
SelectProps<O, V>) => {
  const optionLabel = getOptionLabel(value) || '';
  const cachedRef = React.useRef({ updatePopperPosition: noop });

  const [initialValueLabel] = React.useState(optionLabel);
  const inputRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const inlineRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const [opened, updateOpened] = React.useState(!!open);
  const [directMatch, setDirectMatch] = React.useState(false);
  const [searchLabel, updateSearchLabel] = React.useState(optionLabel);
  const [optionsToRender, updateOptionsToRender] = React.useState(renderOptionsFilter ? options.filter(renderOptionsFilter) : options);
  const [inputWrapperRef, setInputWrapperRef] = React.useState<Nullable<HTMLElement>>(null);
  const [focusedOptionIndex, updateFocusedOptionIndex] = React.useState(multiLevelDropdown ? null : 0);

  const isDropdown = !!label;
  const labelSearchable = !label && searchable;
  const isDropDownOpened = isDropdown && opened;

  const renderDropdown = opened && (!!options.length || searchLabel || !searchable);

  const cache = useCache({
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
    initialValueLabel,
    getOptionLabel,
    optionsMaxSize,
    getOptionValue,
    labelSearchable,
    inputWrapperRef,
    firstOptionIndex: (isDropdown && searchable) || creatable ? 1 : 0,
    multiLevelDropdown,
    showNotMatchedOptions,
  });

  const menuPopoverModifiers = React.useMemo(() => {
    const onComputedStyle = (data: { styles: Record<string, unknown> }) => {
      if (placement === 'bottom-start' && inputWrapperRef) {
        // eslint-disable-next-line no-param-reassign
        data.styles.width = inputWrapperRef.getBoundingClientRect().width;
      }

      return data;
    };

    return {
      hide: { enabled: false },
      autoSizing: { enabled: true, fn: onComputedStyle, order: 840 },
      preventOverflow: { enabled: false },
    };
  }, [inputWrapperRef, placement]);

  const onUpdateOptionsToRender = React.useCallback(
    (label: string) => {
      const { matchedOptions } = cache.current.optionsFilter(cache.current.options, label, {
        grouped: cache.current.grouped,
        maxSize: cache.current.optionsMaxSize,
        showNotMatched: cache.current.showNotMatchedOptions,
        getOptionLabel: cache.current.getOptionLabel,
        getOptionValue: cache.current.getOptionValue,
        multiLevelDropdown: cache.current.multiLevelDropdown,
      });

      const hasExactMatch =
        matchedOptions.length === 1 &&
        cache.current.getOptionLabel(cache.current.getOptionValue(matchedOptions[0]))?.toLowerCase() === label.toLowerCase();

      if (
        hasExactMatch ||
        (!!cache.current.initialValueLabel?.toLowerCase() && cache.current.initialValueLabel?.toLowerCase() === label.toLowerCase())
      ) {
        setDirectMatch(true);
      } else {
        setDirectMatch(false);
      }

      const findIndexCallback = (option: O) => cache.current.value === cache.current.getOptionValue(option);

      let activeOptionIndex;

      if (grouped) {
        activeOptionIndex = (matchedOptions as GroupedOption<O>[]).flatMap((option) => option.options ?? []).findIndex(findIndexCallback);
      } else {
        activeOptionIndex = matchedOptions.findIndex(findIndexCallback);
      }

      if (!cache.current.multiLevelDropdown) {
        if (cache.current.searchable) {
          updateFocusedOptionIndex(matchedOptions.length ? cache.current.firstOptionIndex : 0);
        } else {
          updateFocusedOptionIndex(activeOptionIndex === -1 ? 0 : activeOptionIndex + cache.current.firstOptionIndex);
        }
      }

      updateOptionsToRender(matchedOptions);
    },
    [grouped, updateOptionsToRender, updateFocusedOptionIndex]
  );

  React.useEffect(() => {
    if (renderOptionsFilter && selectedOptions) {
      const nonSelectedOptions = options.filter(renderOptionsFilter);
      updateOptionsToRender(nonSelectedOptions);
    }

    if (autoUpdatePlacement) {
      cachedRef.current.updatePopperPosition();
    }
  }, [selectedOptions, updateOptionsToRender]);

  const onOpenMenu = React.useCallback(
    (e?: React.MouseEvent | React.FocusEvent) => {
      if (inputStopProp) {
        e?.stopPropagation();
      }

      if (cache.current.searchable) {
        inputRef.current?.focus?.();
      }

      if (!cache.current.opened) {
        updateOpened(true);
        cache.current.onOpen?.();
      }

      cache.current.initialValueLabel = optionLabel;

      // Clear the search so all options render

      const hasExistingInputLabel = cache.current.searchable && cache.current.initialValueLabel;
      if (hasExistingInputLabel) {
        cache.current.searchLabel = cache.current.initialValueLabel;
        onUpdateOptionsToRender('');
        setDirectMatch(true);
      } else {
        onUpdateOptionsToRender(cache.current.searchLabel);
      }
    },
    [updateOpened, onUpdateOptionsToRender, optionLabel]
  );

  const onHideMenu = React.useCallback(() => {
    if (cache.current.searchable) {
      inputRef.current?.blur?.();
    }

    if (cache.current.searchable && cache.current.searchLabel !== cache.current.optionLabel) {
      updateSearchLabel(cache.current.optionLabel);
    }

    if (cache.current.multiLevelDropdown) {
      updateFocusedOptionIndex(null);
    }

    updateOpened(false);
    cache.current.onClose?.();
  }, [updateOpened, updateSearchLabel]);

  const onFocusOption = React.useCallback(
    (index: number) => {
      let nextIndex = index;

      const flatOptions = grouped ? (optionsToRender as GroupedOption<O>[]).flatMap((option) => option.options) : optionsToRender;

      if (index < 0) {
        nextIndex = flatOptions.length - (1 - cache.current.firstOptionIndex);
      } else if (index > flatOptions.length - (1 - cache.current.firstOptionIndex)) {
        nextIndex = 0;
      }

      updateFocusedOptionIndex(nextIndex);
    },
    [grouped, optionsToRender, updateFocusedOptionIndex]
  );

  const handleOnSearchLabelChange = (val: string) => {
    onUpdateOptionsToRender(val);
    updateSearchLabel(val);
    onSearch?.(val);
  };

  const onChangeSearchLabel = React.useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const input = formatInputValue ? formatInputValue(target.value) : target.value;
      handleOnSearchLabelChange(input);
    },
    [onUpdateOptionsToRender]
  );

  const onSelectItem = React.useCallback(
    (value: V, optionsPath: number[], updatePopperPosition: () => void) => {
      onSelect(value, optionsPath);
      handleOnSearchLabelChange('');

      if (autoUpdatePlacement) {
        cachedRef.current.updatePopperPosition = updatePopperPosition;
      }
      if (!autoDismiss) {
        return;
      }
      onHideMenu();
    },
    [onSelect, onHideMenu]
  );

  const onCreateItem = React.useCallback(
    (label: string, updatePopperPosition: () => void) => {
      try {
        updateSearchLabel('');
        validateCreate?.(label);
        onCreate?.(label);

        if (autoUpdatePlacement) {
          cachedRef.current.updatePopperPosition = updatePopperPosition;
        }
        if (autoDismiss) {
          onHideMenu();
        }
      } catch (error) {
        toast.warn(error?.message || error?.toString?.() || 'something went wrong');
      }
    },
    [onCreate, onHideMenu]
  );

  React.useEffect(() => {
    onUpdateOptionsToRender(optionLabel);
    updateSearchLabel(optionLabel);
  }, [optionLabel, onUpdateOptionsToRender]);

  useDidUpdateEffect(() => {
    if (open) {
      onOpenMenu();
    } else {
      onHideMenu();
    }
  }, [onHideMenu, onOpenMenu, open]);

  const onIconClick = React.useCallback(() => {
    if (clearable) {
      (onSelect as (value: Nullable<V>, optionsPath: number[]) => void)(null, []);
    } else if (!disabled || !searchable) {
      onOpenMenu();
    }
  }, [clearable, onOpenMenu, onSelect, disabled, searchable]);

  React.useEffect(() => {
    if (inline && inputWrapperRef) {
      inputWrapperRef.style.width = `${inlineRef.current?.clientWidth}px`;
    }
  });

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
    leftAction: prefix ? <PrefixContainer>{prefix}</PrefixContainer> : null,
    searchable: labelSearchable,
    isDropdown: !!label,
    borderLess,
    placeholder,
    onMouseDown: searchable ? onMouseDown : undefined,
    rightAction,
    isDropDownOpened,
    onKeyDown,
  };

  return (
    <Manager>
      <Reference innerRef={setInputWrapperRef}>
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
            {triggerRenderer ? (
              triggerRenderer({
                ...inputProps,
                ref: inputRef,
                value: searchLabel,
                isOpen: opened,
              })
            ) : (
              <Flex>
                {tags ? (
                  <TagsContainer
                    hasTags={selectedOptions?.length}
                    isActive={opened}
                    onClick={() => {
                      onOpenMenu();
                      inputRef?.current?.focus();
                    }}
                  >
                    {tags()}
                    <TagsInput
                      hasTags={selectedOptions?.length}
                      {...inputProps}
                      onBlur={(e) => {
                        if (!renderDropdown) {
                          updateOpened(false);
                        }
                        onBlur?.(e);
                      }}
                      ref={inputRef as React.RefObject<AutosizeInput>}
                      value={label || searchLabel}
                      autoComplete="off"
                    />
                  </TagsContainer>
                ) : (
                  <>
                    <SearchInput {...inputProps} ref={inputRef} value={label || searchLabel} type="search" autoComplete="off" clearable={clearable} />
                    <SearchInputIcon
                      icon={clearable ? 'close' : 'caretDown'}
                      color={isDropDownOpened ? '#5D9DF5' : '#6e849a'}
                      size={10}
                      onClick={onIconClick}
                    />
                  </>
                )}
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
        <AnyAdvancedMenu
          id={id}
          footerAction={footerAction}
          footerActionLabel={footerActionLabel}
          onClickFooterAction={() => {
            onHideMenu();
            onClickFooterAction?.();
          }}
          createLabel={createLabel}
          onHide={onHideMenu}
          grouped={grouped}
          options={optionsToRender}
          onSelect={onSelectItem}
          onCreate={onCreateItem}
          maxHeight={maxHeight}
          autoWidth={autoWidth}
          creatable={creatable}
          placement={placement}
          searchable={searchable}
          isDropdown={isDropdown}
          directSearchMatch={directMatch}
          searchLabel={searchLabel}
          alwaysShowCreate={alwaysShowCreate}
          getOptionKey={getOptionKey}
          onFocusOption={onFocusOption}
          withSearchIcon={withSearchIcon}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          inputWrapperRef={inputWrapperRef}
          formatInputValue={formatInputValue}
          firstOptionIndex={cache.current.firstOptionIndex}
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
};

export default Select;
