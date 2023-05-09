import composeRef from '@seznam/compose-react-refs';
import Menu from '@ui/components/Menu';
import Portal from '@ui/components/Portal';
import { useDidUpdateEffect, useNestedPopperTheme, usePersistFunction } from '@ui/hooks';
import { ThemeProvider } from '@ui/styles';
import { swallowEvent } from '@ui/utils';
import { Nullable } from '@voiceflow/common';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { DismissableLayerProvider } from 'react-dismissable-layers';
import { Popper } from 'react-popper';

import MenuHeader from '../MenuHeader';
// eslint-disable-next-line import/no-cycle
import MenuOptions from '../MenuOptions';
import { GetOptionKey, MenuItemGrouped, MenuItemMultilevel, MenuItemWithID } from '../types';
import { isBaseMenuItem, isGroupedOptions, isMenuItemGrouped, isMenuItemMultilevel, isUIOnlyMenuItemOption } from '../utils';
import { MenuPopoverContainer } from './components';
import {
  NestedMenuCreatableProps,
  NestedMenuCreatableWithIDProps,
  NestedMenuGroupedProps,
  NestedMenuInternalProps,
  NestedMenuMultilevelProps,
  NestedMenuProps,
  NestedMenuWithIDGroupedProps,
  NestedMenuWithIDMultilevelProps,
  NestedMenuWithIDProps,
} from './types';

enum KeyCode {
  TAB = 'Tab',
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
}
export const DEFAULT_PATH = [];

function BaseNestedMenu<Option extends MenuItemWithID, Value = Option>(props: NestedMenuCreatableWithIDProps<Option, Value>): React.ReactElement;
function BaseNestedMenu<Option extends MenuItemWithID, Value = Option>(props: NestedMenuWithIDProps<Option, Value>): React.ReactElement;
function BaseNestedMenu<Option, GroupedOption extends MenuItemGrouped<Option>, Value = Option>(
  props: NestedMenuGroupedProps<Option, GroupedOption, Value>
): React.ReactElement;
function BaseNestedMenu<Option extends MenuItemMultilevel<Option>, Value = Option>(
  props: NestedMenuMultilevelProps<Option, Value>
): React.ReactElement;
function BaseNestedMenu<Option extends MenuItemWithID, GroupedOption extends MenuItemGrouped<Option>, Value = Option>(
  props: NestedMenuWithIDGroupedProps<Option, GroupedOption, Value>
): React.ReactElement;
function BaseNestedMenu<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value = Option>(
  props: NestedMenuWithIDMultilevelProps<Option, Value>
): React.ReactElement;
function BaseNestedMenu<Option, Value = Option>(props: NestedMenuCreatableProps<Option, Value>): React.ReactElement;
function BaseNestedMenu<Option, Value = Option>(props: NestedMenuProps<Option, Value>): React.ReactElement;
function BaseNestedMenu({
  id,
  onHide,
  isRoot = true,
  grouped,
  options,
  maxWidth,
  onSelect,
  onCreate,
  minWidth,
  maxHeight,
  creatable,
  autoWidth,
  placement,
  menuProps,
  searchable,
  isDropdown,
  portalNode,
  optionsPath = DEFAULT_PATH,
  searchLabel = '',
  createLabel,
  renderEmpty,
  containerRef,
  getOptionKey,
  isMultiLevel,
  onFocusOption,
  getOptionValue,
  getOptionLabel,
  maxVisibleItems = Menu.MAX_VISIBLE_ITEMS,
  inputWrapperNode,
  formatInputValue,
  alwaysShowCreate,
  inDropdownSearch,
  popoverModifiers,
  disableAnimation,
  firstOptionIndex = 0,
  isButtonDisabled,
  referenceElement,
  onContainerClick,
  directSearchMatch = false,
  renderOptionLabel,
  onCreateInputBlur,
  onCreateInputFocus,
  focusedOptionIndex = null,
  renderFooterAction,
  renderSearchSuffix,
  popperPositionFixed,
  onBackFocusToParent,
  onChangeSearchLabel,
  createInputAutofocus,
  onContainerMouseDown,
  nestedPopoverModifiers = { offset: { enabled: true, offset: '4,0' } },
  createInputPlaceholder,
}: NestedMenuInternalProps): React.ReactElement {
  const menuRef = React.useRef<HTMLUListElement>(null);
  const nestedTheme = useNestedPopperTheme();
  const scrollbarsRef = React.useRef<Scrollbars>(null);
  const createInputRef = React.useRef<HTMLInputElement>(null);
  const focusedOptionRef = React.useRef<Nullable<HTMLLIElement>>(null);
  const prevFocusedOptionIndexRef = React.useRef(focusedOptionIndex);
  const [newOptionLabel, updateSearchLabel] = React.useState(searchLabel);
  const [childFocusItemIndex, setChildFocusItemIndex] = React.useState<Nullable<number>>(null);
  const focusedOption = focusedOptionIndex === null ? undefined : options[focusedOptionIndex - firstOptionIndex];

  const dataRef = React.useRef({
    scheduleUpdate: (): void => undefined,
    blockOptionHover: false,
    scrollToFocusedOption: focusedOptionIndex !== null && focusedOptionIndex - firstOptionIndex >= 0,
  });

  const onMouseMove = () => {
    dataRef.current.blockOptionHover = false;
  };

  const onChildFocusItemIndex = (nextIndex: number) => {
    if (!isMenuItemGrouped(!!grouped, focusedOption) && !isMenuItemMultilevel(!!isMultiLevel, focusedOption)) return;

    const childOptions = focusedOption.options ?? [];

    let index = nextIndex >= childOptions.length ? 0 : nextIndex;

    index = index < 0 ? childOptions.length - 1 : index;

    const nextChildFocusedOption = childOptions[index];

    if (
      isBaseMenuItem(nextChildFocusedOption) &&
      (nextChildFocusedOption.disabled || nextChildFocusedOption.readOnly || nextChildFocusedOption.vfUIOnly)
    )
      return;

    setChildFocusItemIndex(index);
  };

  const onFocusItem = (index: number) => {
    let nextIndex = index;

    const flatOptions = isGroupedOptions(!!grouped, options)
      ? options.flatMap((option) => (isUIOnlyMenuItemOption(option) ? option : option.options ?? []))
      : options;

    if (index < 0) {
      nextIndex = flatOptions.length - (1 - firstOptionIndex);
    } else if (index > flatOptions.length - (1 - firstOptionIndex)) {
      nextIndex = 0;
    }

    const nextFocusedOption = options[Math.max(nextIndex - firstOptionIndex, 0)];

    if (isBaseMenuItem(nextFocusedOption) && (nextFocusedOption.disabled || nextFocusedOption.readOnly || nextFocusedOption.vfUIOnly)) return;

    setChildFocusItemIndex(null);
    onFocusOption?.(nextIndex);

    if (nextIndex === 0) {
      createInputRef.current?.focus();
    } else {
      createInputRef.current?.blur();
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onKeydown = usePersistFunction((event: KeyboardEvent) => {
    // eslint-disable-next-line xss/no-mixed-html
    const isInput = (event.target as Nullable<HTMLElement>)?.tagName === 'INPUT';
    const isNotFocused = focusedOptionIndex === null;
    const isChildFocused = childFocusItemIndex !== null;

    if (!isInput && !isChildFocused && isMultiLevel && event.key === KeyCode.ARROW_LEFT) {
      swallowEvent(null, true)(event);
      onBackFocusToParent?.();
      return;
    }

    if ((isRoot && isChildFocused) || (!isRoot && (isNotFocused || isChildFocused))) return;

    dataRef.current.blockOptionHover = true;
    dataRef.current.scrollToFocusedOption = true;

    const flatOptions = isGroupedOptions(!!grouped, options) ? options.flatMap((option) => option.options) : options;

    switch (event.key) {
      case KeyCode.TAB:
      case KeyCode.ENTER:
        {
          if (focusedOptionIndex === null) return;

          const nextValue = searchable && creatable ? searchLabel : newOptionLabel;

          if (creatable && focusedOptionIndex === 0 && nextValue && !isButtonDisabled?.({ value: nextValue })) {
            swallowEvent(null, true)(event);
            onCreate?.(nextValue, dataRef.current.scheduleUpdate);
          } else if (
            (!isInput ||
              (event.target && inputWrapperNode?.contains(event.target as Node)) ||
              (creatable && searchable) ||
              (isDropdown && searchable)) &&
            (!creatable || focusedOptionIndex > 0)
          ) {
            swallowEvent(null, true)(event);

            const option = flatOptions[focusedOptionIndex - firstOptionIndex];

            if (isBaseMenuItem(option) && (option.disabled || option.vfUIOnly)) return;

            onSelect(getOptionValue(option), optionsPath, dataRef.current.scheduleUpdate);
          }
        }
        break;

      case KeyCode.ESCAPE:
        swallowEvent(null, true)(event);
        onHide();
        break;

      case KeyCode.ARROW_UP:
        {
          const nextIndex = isNotFocused ? options.length - 1 : focusedOptionIndex - 1;
          const nextFocusedOption = options[nextIndex - firstOptionIndex];

          swallowEvent(null, true)(event);
          onFocusItem(isBaseMenuItem(nextFocusedOption) && nextFocusedOption.vfUIOnly ? nextIndex - 1 : nextIndex);
        }
        break;

      case KeyCode.ARROW_DOWN:
        {
          const nextIndex = isNotFocused ? 0 : focusedOptionIndex + 1;
          const nextFocusedOption = options[nextIndex - firstOptionIndex];

          swallowEvent(null, true)(event);
          onFocusItem(isBaseMenuItem(nextFocusedOption) && nextFocusedOption.vfUIOnly ? nextIndex + 1 : nextIndex);
        }
        break;

      case KeyCode.ARROW_RIGHT:
        if (!isInput && isMenuItemMultilevel(!!isMultiLevel, focusedOption) && focusedOption.options?.length) {
          swallowEvent(null, true)(event);
          setChildFocusItemIndex(0);
        }
        break;
      default:
      // empty
    }
  });

  const onClickOutside = usePersistFunction((event: MouseEvent) => {
    const isNotFocused = focusedOptionIndex === null;
    const isChildFocused = childFocusItemIndex !== null;

    if ((isRoot && isChildFocused) || (!isRoot && (isNotFocused || isChildFocused))) {
      return;
    }

    if (
      event.target !== inputWrapperNode &&
      (!inputWrapperNode || !event.target || !inputWrapperNode.contains(event.target as Node)) &&
      menuRef.current &&
      (!event.target || !menuRef.current.contains(event.target as Node))
    ) {
      event.stopPropagation();
      onHide();
    }
  });

  const onItemRef = (index: number) => (node: Nullable<HTMLLIElement>) => {
    if (focusedOptionIndex === index) {
      focusedOptionRef.current = node;
    }
  };

  React.useEffect(() => {
    updateSearchLabel(searchLabel);
  }, [searchLabel, updateSearchLabel]);

  React.useLayoutEffect(() => {
    const scrollbars = scrollbarsRef.current;
    const focusedOption = focusedOptionRef.current;
    const prevFocusedOptionIndex = prevFocusedOptionIndexRef.current;

    prevFocusedOptionIndexRef.current = focusedOptionIndex;

    if (!scrollbars || !focusedOption || !dataRef.current.scrollToFocusedOption) return;

    const scrollTop = scrollbars.getScrollTop();
    const topToBottom = (focusedOptionIndex ?? 0) > (prevFocusedOptionIndex ?? 0);
    const clientHeight = scrollbars.getClientHeight();
    const scrollHeight = scrollbars.getScrollHeight();
    const focusedOptionTop = focusedOption.offsetTop;
    const focusedOptionHeight = focusedOption.offsetHeight;
    const focusedOptionBottom = focusedOptionTop + focusedOptionHeight;

    dataRef.current.scrollToFocusedOption = false;

    if (topToBottom) {
      if (focusedOptionBottom > clientHeight + scrollTop) {
        scrollbars.scrollTop(focusedOptionBottom - clientHeight);
      } else if (focusedOptionTop < scrollTop) {
        scrollbars.scrollTop(focusedOptionTop);
      }
    } else if (!topToBottom && focusedOptionTop < scrollTop) {
      scrollbars.scrollTop(Math.min(focusedOptionTop, scrollHeight - clientHeight));
    }
  }, [focusedOptionIndex]);

  React.useEffect(() => {
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('click', onClickOutside);
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);

  useDidUpdateEffect(() => {
    dataRef.current.scheduleUpdate?.();
  }, [searchLabel]);

  return (
    <Portal portalNode={portalNode || document.body}>
      <DismissableLayerProvider>
        <ThemeProvider theme={nestedTheme}>
          <Popper
            placement={placement}
            modifiers={{ ...popoverModifiers, isRoot: { value: isRoot } }}
            positionFixed={popperPositionFixed}
            referenceElement={referenceElement}
          >
            {({ ref, style, scheduleUpdate, placement: parentPlacement }) => {
              dataRef.current.scheduleUpdate = scheduleUpdate;

              return (
                <MenuPopoverContainer
                  ref={composeRef(ref, containerRef)}
                  style={style}
                  isRoot={isRoot}
                  onClick={onContainerClick}
                  minWidth={minWidth}
                  maxWidth={maxWidth}
                  autoWidth={autoWidth}
                  onMouseMove={onMouseMove}
                  onMouseDown={onContainerMouseDown}
                >
                  <Menu
                    id={id}
                    ref={menuRef}
                    onHide={onHide}
                    maxHeight={maxHeight}
                    placement={parentPlacement}
                    fullWidth
                    searchable={
                      (((creatable || (searchable && isDropdown)) && !directSearchMatch) || inDropdownSearch) && (
                        <MenuHeader
                          onHide={onHide}
                          onFocus={() => !dataRef.current.blockOptionHover && onFocusItem(0)}
                          onCreate={(val) => onCreate?.(val, scheduleUpdate)}
                          creatable={creatable}
                          hasOptions={!!options.length}
                          isDropdown={isDropdown}
                          searchable={searchable}
                          createLabel={createLabel}
                          searchLabel={searchLabel}
                          onInputBlur={onCreateInputBlur}
                          onInputFocus={onCreateInputFocus}
                          createInputRef={createInputRef}
                          newOptionLabel={newOptionLabel}
                          inDropdownSearch={inDropdownSearch}
                          alwaysShowCreate={alwaysShowCreate}
                          focusedOptionRef={focusedOptionRef}
                          isButtonDisabled={isButtonDisabled}
                          updateSearchLabel={(value) => updateSearchLabel(formatInputValue ? formatInputValue(value) : value)}
                          renderSearchSuffix={renderSearchSuffix}
                          focusedOptionIndex={focusedOptionIndex}
                          onChangeSearchLabel={onChangeSearchLabel}
                          createInputAutofocus={createInputAutofocus}
                          createInputPlaceholder={createInputPlaceholder}
                        />
                      )
                    }
                    scrollbarsRef={scrollbarsRef}
                    maxVisibleItems={maxVisibleItems}
                    disableAnimation={disableAnimation}
                    renderFooterAction={
                      renderFooterAction &&
                      ((props) => renderFooterAction({ ...props, searchLabel: (searchable ? searchLabel : newOptionLabel) ?? '' }))
                    }
                    {...menuProps}
                  >
                    <MenuOptions
                      onHide={onHide}
                      options={options}
                      grouped={grouped}
                      onSelect={onSelect}
                      placement={isRoot ? undefined : parentPlacement}
                      autoWidth={autoWidth}
                      searchable={searchable}
                      onItemRef={onItemRef}
                      searchLabel={searchLabel}
                      optionsPath={optionsPath}
                      onFocusItem={(index) => !dataRef.current.blockOptionHover && onFocusItem(index)}
                      renderEmpty={renderEmpty}
                      isMultiLevel={isMultiLevel}
                      getOptionKey={getOptionKey as GetOptionKey<unknown>}
                      getOptionLabel={getOptionLabel}
                      updatePosition={scheduleUpdate}
                      getOptionValue={getOptionValue}
                      inputWrapperNode={inputWrapperNode}
                      firstOptionIndex={firstOptionIndex}
                      popoverModifiers={{ ...popoverModifiers, ...nestedPopoverModifiers }}
                      renderOptionLabel={renderOptionLabel}
                      focusedOptionIndex={focusedOptionIndex}
                      childFocusItemIndex={childFocusItemIndex}
                      onBackFocusToParent={() => requestAnimationFrame(() => setChildFocusItemIndex(null))}
                      onChildFocusItemIndex={onChildFocusItemIndex}
                    />
                  </Menu>
                </MenuPopoverContainer>
              );
            }}
          </Popper>
        </ThemeProvider>
      </DismissableLayerProvider>
    </Portal>
  );
}

export default BaseNestedMenu;
