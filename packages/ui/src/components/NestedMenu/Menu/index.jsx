/* eslint-disable no-shadow */
import Menu from '@ui/components/Menu';
import Portal from '@ui/components/Portal';
import { useDidUpdateEffect } from '@ui/hooks';
import { setRef, stopImmediatePropagation, swallowEvent } from '@ui/utils';
import _constant from 'lodash/constant';
import React from 'react';
import { Popper } from 'react-popper';

import MenuHeader from '../MenuHeader';
import MenuOptions from '../MenuOptions';
import { FooterActionContainer, MenuPopoverContainer } from './components';

const KeyCodes = {
  TAB: 'Tab',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
};

export const DEFAULT_PATH = [];

/* this component can be used w/ Manager
 *(e.g. Select component implementation)
 */
function BaseNestedMenu({
  id,
  withSearchIcon,
  onHide,
  isRoot = true,
  grouped,
  options,
  onSelect,
  directSearchMatch = false,
  createLabel,
  onCreate,
  maxHeight,
  footerAction,
  footerActionLabel,
  onClickFooterAction,
  creatable,
  autoWidth,
  placement,
  searchable,
  isDropdown,
  optionsPath = DEFAULT_PATH,
  searchLabel,
  getOptionKey,
  onFocusOption,
  getOptionValue,
  getOptionLabel,
  inputWrapperRef,
  isButtonDisabled = _constant(false),
  formatInputValue,
  alwaysShowCreate,
  inDropdownSearch,
  popoverModifiers,
  disableAnimation,
  firstOptionIndex = 0,
  renderOptionLabel,
  focusedOptionIndex,
  multiLevelDropdown,
  onBackFocusToParent,
  onChangeSearchLabel,
  createInputPlaceholder,
  portalNode,
  menuProps,
  renderEmpty,
}) {
  const cachedRef = React.useRef({ blockOptionHover: false, scrollToFocusedOption: true });
  const menuRef = React.useRef();
  const scrollbarsRef = React.useRef();
  const createInputRef = React.useRef();
  const focusedOptionRef = React.useRef();
  const [newOptionLabel, updateSearchLabel] = React.useState(searchLabel);
  const [childFocusItemIndex, setChildFocusItemIndex] = React.useState(null);

  const focusedItemOptions = options[focusedOptionIndex - firstOptionIndex]?.options;

  const onMouseMove = React.useCallback(() => {
    cachedRef.current.blockOptionHover = false;
  }, []);

  const onChildFocusItemIndex = React.useCallback(
    (nextIndex) => {
      let index = nextIndex >= focusedItemOptions.length ? 0 : nextIndex;

      index = index < 0 ? focusedItemOptions.length - 1 : index;

      if (focusedItemOptions[index]?.disabled) {
        return;
      }

      setChildFocusItemIndex(index);
    },
    [focusedItemOptions, firstOptionIndex]
  );

  const onFocusItem = React.useCallback(
    (index) => {
      let nextIndex = index >= cachedRef.current.options?.length ? 0 : index;
      nextIndex = nextIndex < 0 ? cachedRef.current.options?.length - 1 : nextIndex;

      if (cachedRef.current.options?.[nextIndex]?.disabled) {
        return;
      }

      setChildFocusItemIndex(null);
      onFocusOption(index);

      if (index === 0) {
        createInputRef.current?.focus();
      } else {
        createInputRef.current?.blur();
      }
    },
    [onFocusOption]
  );

  const onBackFocus = React.useCallback(() => {
    requestAnimationFrame(() => setChildFocusItemIndex(null));
  }, []);

  React.useEffect(() => {
    updateSearchLabel(searchLabel);
  }, [searchLabel, updateSearchLabel]);

  React.useEffect(() => {
    if (focusedOptionRef.current && cachedRef.current.scrollToFocusedOption) {
      const menuRect = scrollbarsRef.current.container.getBoundingClientRect();
      const focusedRect = focusedOptionRef.current.getBoundingClientRect();
      const overScroll = focusedOptionRef.current.offsetHeight / 3;

      if (focusedRect.bottom + overScroll > menuRect.bottom) {
        scrollbarsRef.current.scrollTop(
          Math.min(
            focusedOptionRef.current.offsetTop + focusedOptionRef.current.clientHeight - scrollbarsRef.current.container.offsetHeight + overScroll,
            scrollbarsRef.current.getScrollHeight()
          )
        );
      } else if (focusedRect.top - overScroll < menuRect.top) {
        scrollbarsRef.current.scrollTop(Math.max(focusedOptionRef.current.offsetTop - overScroll, 0));
      }

      cachedRef.current.scrollToFocusedOption = false;
    }
  }, [focusedOptionIndex]);

  cachedRef.current = {
    ...cachedRef.current,
    isRoot,
    onHide,
    options,
    grouped,
    onCreate,
    onSelect,
    creatable,
    searchable,
    searchLabel,
    onFocusItem,
    optionsPath,
    focusedIndex: focusedOptionIndex,
    newOptionLabel,
    getOptionValue,
    inputWrapperRef,
    childFocusIndex: childFocusItemIndex,
    firstOptionIndex,
    isButtonDisabled,
    multiLevelDropdown,
    onBackFocusToParent,
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  React.useEffect(() => {
    const keydownCallback = (e) => {
      const {
        isRoot,
        grouped,
        onHide,
        options,
        onCreate,
        onSelect,
        creatable,
        searchable,
        searchLabel,
        optionsPath,
        onFocusItem,
        focusedIndex,
        newOptionLabel,
        inputWrapperRef,
        childFocusIndex,
        firstOptionIndex,
        isButtonDisabled,
        multiLevelDropdown,
        onBackFocusToParent,
        scheduleUpdate,
      } = cachedRef.current;

      const isInput = e.target.tagName === 'INPUT';
      const isNotFocused = focusedIndex === null;
      const isChildFocused = childFocusIndex !== null;

      if (!isInput && !isChildFocused && multiLevelDropdown && e.key === KeyCodes.ARROW_LEFT) {
        swallowEvent(null, true)(e);
        onBackFocusToParent?.();
        return;
      }

      if ((isRoot && isChildFocused) || (!isRoot && (isNotFocused || isChildFocused))) {
        return;
      }

      cachedRef.current.blockOptionHover = true;
      cachedRef.current.scrollToFocusedOption = true;

      const flatOptions = grouped ? options.flatMap((option) => option.options) : options;

      if (e.key === KeyCodes.ENTER || e.key === KeyCodes.TAB) {
        const nextValue = searchable && creatable ? searchLabel : newOptionLabel;

        if (creatable && focusedIndex === 0 && nextValue && !isButtonDisabled(nextValue)) {
          swallowEvent(null, true)(e);
          onCreate(nextValue, scheduleUpdate);
        } else if (
          (!isInput || inputWrapperRef?.contains(e.target) || (creatable && searchable) || (isDropdown && searchable)) &&
          (!creatable || focusedIndex > 0)
        ) {
          swallowEvent(null, true)(e);

          const option = flatOptions[focusedIndex - firstOptionIndex];

          if (!option?.disabled) {
            onSelect(cachedRef.current.getOptionValue(flatOptions[focusedIndex - firstOptionIndex]), optionsPath, scheduleUpdate);
          }
        }
      } else if (e.key === KeyCodes.ESCAPE) {
        swallowEvent(null, true)(e);
        onHide();
      } else if (e.key === KeyCodes.ARROW_UP) {
        swallowEvent(null, true)(e);
        onFocusItem((isNotFocused ? options.length : focusedIndex) - 1);
      } else if (e.key === KeyCodes.ARROW_DOWN) {
        swallowEvent(null, true)(e);
        onFocusItem(isNotFocused ? 0 : focusedIndex + 1);
      } else if (!isInput && multiLevelDropdown && options?.[focusedIndex - firstOptionIndex]?.options?.length && e.key === KeyCodes.ARROW_RIGHT) {
        swallowEvent(null, true)(e);
        setChildFocusItemIndex(0);
      }
    };

    const clickCallback = (e) => {
      const { onHide, focusedIndex, isRoot, inputWrapperRef, childFocusIndex } = cachedRef.current;

      const isNotFocused = focusedIndex === null;
      const isChildFocused = childFocusIndex !== null;

      if ((isRoot && isChildFocused) || (!isRoot && (isNotFocused || isChildFocused))) {
        return;
      }

      if (e.target !== inputWrapperRef && (!inputWrapperRef || !inputWrapperRef.contains(e.target)) && !menuRef.current.contains(e.target)) {
        e.stopPropagation();
        onHide();
      }
    };

    document.addEventListener('click', clickCallback);
    document.addEventListener('keydown', keydownCallback);

    return () => {
      document.removeEventListener('click', clickCallback);
      document.removeEventListener('keydown', keydownCallback);
    };
  }, [inputWrapperRef]);

  const onItemRef = (index, ref) => (node) => {
    setRef(ref, node);

    if (focusedOptionIndex === index) {
      focusedOptionRef.current = node;
    }
  };

  useDidUpdateEffect(() => {
    cachedRef.current?.scheduleUpdate?.();
  }, [searchLabel]);

  return (
    <Portal portalNode={portalNode || document.body}>
      <Popper placement={placement} modifiers={popoverModifiers}>
        {({ ref, style, scheduleUpdate, placement: parentPlacement }) => {
          if (cachedRef.current) {
            cachedRef.current.scheduleUpdate = scheduleUpdate;
          }
          return (
            <MenuPopoverContainer ref={ref} style={style} isRoot={isRoot} autoWidth={autoWidth} onMouseMove={onMouseMove}>
              <Menu
                id={id}
                footerAction={footerAction}
                footerActionComponent={() => (
                  <FooterActionContainer onClick={stopImmediatePropagation(onClickFooterAction)}>{footerActionLabel}</FooterActionContainer>
                )}
                ref={menuRef}
                maxHeight={maxHeight}
                fullWidth
                searchable={
                  (((creatable || (searchable && isDropdown)) && !directSearchMatch) || inDropdownSearch) && (
                    <MenuHeader
                      inDropdownSearch={inDropdownSearch}
                      alwaysShowCreate={alwaysShowCreate}
                      createLabel={createLabel}
                      withSearchIcon={withSearchIcon}
                      onCreate={(val) => onCreate(val, scheduleUpdate)}
                      isDropdown={isDropdown}
                      searchable={searchable}
                      creatable={creatable}
                      searchLabel={searchLabel}
                      onFocus={() => !cachedRef.current.blockOptionHover && onFocusItem(0)}
                      createInputRef={createInputRef}
                      newOptionLabel={newOptionLabel}
                      focusedOptionRef={focusedOptionRef}
                      isButtonDisabled={isButtonDisabled}
                      updateSearchLabel={(value) => {
                        updateSearchLabel(formatInputValue ? formatInputValue(value) : value);
                      }}
                      focusedOptionIndex={focusedOptionIndex}
                      onChangeSearchLabel={onChangeSearchLabel}
                      createInputPlaceholder={createInputPlaceholder}
                    />
                  )
                }
                scrollbarsRef={scrollbarsRef}
                disableAnimation={disableAnimation}
                {...menuProps}
              >
                <MenuOptions
                  onHide={onHide}
                  options={options}
                  grouped={grouped}
                  onSelect={onSelect}
                  placement={isRoot ? undefined : parentPlacement}
                  autoWidth={autoWidth}
                  onItemRef={onItemRef}
                  searchLabel={searchLabel}
                  optionsPath={optionsPath}
                  onFocusItem={(index) => !cachedRef.current.blockOptionHover && onFocusItem(index)}
                  onBackFocus={onBackFocus}
                  renderEmpty={renderEmpty}
                  getOptionKey={getOptionKey}
                  getOptionLabel={getOptionLabel}
                  updatePosition={scheduleUpdate}
                  getOptionValue={getOptionValue}
                  inputWrapperRef={inputWrapperRef}
                  firstOptionIndex={firstOptionIndex}
                  popoverModifiers={popoverModifiers}
                  renderOptionLabel={renderOptionLabel}
                  focusedOptionIndex={focusedOptionIndex}
                  multiLevelDropdown={multiLevelDropdown}
                  childFocusItemIndex={childFocusItemIndex}
                  onChildFocusItemIndex={onChildFocusItemIndex}
                />
              </Menu>
            </MenuPopoverContainer>
          );
        }}
      </Popper>
    </Portal>
  );
}

export default BaseNestedMenu;
