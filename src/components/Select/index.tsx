import React from 'react';
import { Manager, PopperProps, Reference } from 'react-popper';

import Flex from '@/components/Flex';
import { AdvancedMenu, defaultLabelRenderer } from '@/components/NestedMenu';
import Portal from '@/components/Portal';
import { toast } from '@/components/Toast';
import { useCache, useDidUpdateEffect } from '@/hooks';
import { Nullable } from '@/types';

import { InlineInputValue, PrefixContainer, SearchInput, SearchInputIcon, SelectWrapper } from './components';
import { defaultOptionsFilter, searchableOptionsFilter } from './optionsFilters';

export { defaultLabelRenderer, defaultOptionsFilter, searchableOptionsFilter };

export type GetOptionLabel<V> = (value?: V) => string | undefined | null;

export type GetOptionValue<O, V> = (option?: O) => V;

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
  open?: boolean;
  label?: string;
  value?: V;
  inline?: boolean;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onOpen?: () => void;
  prefix?: React.ReactNode;
  options: O[];
  onClose?: () => void;
  grouped?: boolean;
  minWidth?: boolean;
  onSelect: (value: V, optionsPath: number[]) => void;
  disabled?: boolean;
  placement?: PopperProps['placement'];
  autoWidth?: boolean;
  fullWidth?: boolean;
  clearable?: boolean | never;
  autoFocus?: boolean;
  maxHeight?: number | string;
  className?: string;
  borderLess?: boolean;
  searchable?: boolean;
  rightAction?: React.ReactNode;
  placeholder?: string;
  renderAsSpan?: boolean;
  getOptionKey?: (option: O) => string;
  optionsFilter?: OptionsFilter<O, V>;
  getOptionValue?: GetOptionValue<O, V>;
  getOptionLabel?: GetOptionLabel<V>;
  withSearchIcon?: boolean;
  optionsMaxSize?: number;
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
  label = '',
  value,
  inline = false,
  onBlur,
  onOpen,
  prefix,
  onClose,
  grouped,
  options = [],
  minWidth = true,
  disabled,
  onSelect,
  onCreate,
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
  placeholder,
  getOptionValue = defaultGetter as GetOptionValue<O, V>,
  getOptionKey = (getOptionValue as any) as (option: O) => string,
  renderAsSpan,
  optionsFilter = searchable ? searchableOptionsFilter : defaultOptionsFilter,
  getOptionLabel = defaultGetter as GetOptionLabel<V>,
  withSearchIcon,
  optionsMaxSize,
  triggerRenderer,
  formatInputValue,
  isButtonDisabled,
  renderOptionLabel = defaultLabelRenderer,
  multiLevelDropdown,
  showNotMatchedOptions,
  createInputPlaceholder,
  validateCreate,
}: SelectProps<O, V>) => {
  const optionLabel = getOptionLabel(value) || '';

  const inputRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const inlineRef = React.useRef<Nullable<HTMLInputElement>>(null);
  const [opened, updateOpened] = React.useState(!!open);
  const [searchLabel, updateSearchLabel] = React.useState(optionLabel);
  const [optionsToRender, updateOptionsToRender] = React.useState(options);
  const [inputWrapperRef, setInputWrapperRef] = React.useState<Nullable<HTMLElement>>(null);
  const [focusedOptionIndex, updateFocusedOptionIndex] = React.useState(multiLevelDropdown ? null : 0);

  const isDropdown = !!label;
  const labelSearchable = !label && searchable;
  const isDropDownOpened = isDropdown && opened;

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
    getOptionLabel,
    optionsMaxSize,
    getOptionValue,
    inputWrapperRef,
    firstOptionIndex: (isDropdown && searchable) || creatable ? 1 : 0,
    multiLevelDropdown,
    showNotMatchedOptions,
  });

  const menuPopoverModifiers = React.useMemo(() => {
    const onComputedStyle = (data: { styles: Record<string, unknown> }) => {
      if (placement === 'bottom-start' && inputWrapperRef) {
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
      const { filteredOptions, matchedOptions } = cache.current.optionsFilter(cache.current.options, label, {
        grouped: cache.current.grouped,
        maxSize: cache.current.optionsMaxSize,
        showNotMatched: cache.current.showNotMatchedOptions,
        getOptionLabel: cache.current.getOptionLabel,
        getOptionValue: cache.current.getOptionValue,
        multiLevelDropdown: cache.current.multiLevelDropdown,
      });

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

      updateOptionsToRender(filteredOptions);
    },
    [grouped, updateOptionsToRender, updateFocusedOptionIndex]
  );

  const onOpenMenu = React.useCallback(
    (e?: React.MouseEvent | React.FocusEvent) => {
      e?.stopPropagation();
      inputRef.current?.focus?.();

      if (!cache.current.opened) {
        updateOpened(true);
        onUpdateOptionsToRender(cache.current.searchLabel);
        cache.current.onOpen?.();
      }
    },
    [updateOpened, onUpdateOptionsToRender]
  );

  const onHideMenu = React.useCallback(() => {
    inputRef.current?.blur?.();

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

  const onChangeSearchLabel = React.useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const input = formatInputValue ? formatInputValue(target.value) : target.value;

      onUpdateOptionsToRender(input);
      updateSearchLabel(input);
    },
    [onUpdateOptionsToRender]
  );

  const onSelectItem = React.useCallback(
    (value: V, optionsPath: number[]) => {
      onSelect(value, optionsPath);
      onHideMenu();
    },
    [onSelect, onHideMenu]
  );

  const onCreateItem = React.useCallback(
    (label: string) => {
      try {
        validateCreate?.(label);
        onCreate?.(label);
        onHideMenu();
      } catch (error) {
        toast.warn(error?.message || error?.toString?.() || 'something went wrong');
        console.error(error);
      }
    },
    [onCreate, onHideMenu]
  );

  React.useEffect(() => {
    onUpdateOptionsToRender(optionLabel);
    updateSearchLabel(optionLabel);
  }, [optionLabel, onUpdateOptionsToRender]);

  useDidUpdateEffect(() => {
    open ? onOpenMenu() : onHideMenu();
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
    inline,
    onBlur,
    opened,
    onFocus: searchable ? onOpenMenu : undefined,
    onClick: searchable ? onOpenMenu : undefined,
    disabled: disabled || !labelSearchable,
    onChange: onChangeSearchLabel,
    isFocused: opened,
    fullWidth,
    autoFocus,
    leftAction: prefix ? <PrefixContainer>{prefix}</PrefixContainer> : null,
    searchable: labelSearchable,
    isDropdown: !!label,
    borderLess,
    placeholder,
    rightAction,
    isDropDownOpened,
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
                <SearchInput {...inputProps} ref={inputRef} value={label || searchLabel} type="search" autoComplete="off" clearable={clearable} />

                <SearchInputIcon
                  icon={clearable ? 'close' : 'caretDown'}
                  color={isDropDownOpened ? '#5D9DF5' : '#6e849a'}
                  size={10}
                  onClick={onIconClick}
                />
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

      {opened && (
        <AnyAdvancedMenu
          id={id}
          withSearchIcon={withSearchIcon}
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
          formatInputValue={formatInputValue}
          searchLabel={searchLabel}
          getOptionKey={getOptionKey}
          onFocusOption={onFocusOption}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          inputWrapperRef={inputWrapperRef}
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
