import _constant from 'lodash/constant';
import React from 'react';
import { Popper } from 'react-popper';

import Menu from '@/componentsV2/Menu';
import Portal from '@/componentsV2/Portal';
import { swallowEvent } from '@/utils/dom';

import { setRef } from '../../utils';
import MenuHeader from '../MenuHeader';
import MenuOptions from '../MenuOptions';
import { MenuPopoverContainer } from './components';

const KeyCodes = {
  TAB: 'Tab',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
};

const DEFAULT_PATH = [];

function SelectMenu({
  onHide,
  isRoot = true,
  grouped,
  options,
  onSelect,
  onCreate,
  creatable,
  autoWidth,
  placement,
  optionsPath = DEFAULT_PATH,
  searchLabel,
  formatValue,
  getOptionKey,
  onFocusOption,
  getOptionValue,
  menuSearchable,
  getOptionLabel,
  inputWrapperRef,
  isButtonDisabled = _constant(false),
  popoverModifiers,
  disableAnimation,
  firstOptionIndex = 0,
  renderOptionLabel,
  focusedOptionIndex,
  multiLevelDropdown,
  onBackFocusToParent,
  onChangeSearchLabel,
  createInputPlaceholder,
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
    (index) => {
      const i = index >= focusedItemOptions.length ? 0 : index;

      setChildFocusItemIndex(i < 0 ? focusedItemOptions.length - 1 : i);
    },
    [focusedItemOptions, firstOptionIndex] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onFocusItem = React.useCallback(
    (index) => {
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
    onFocusItem,
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
        onFocusItem,
        focusedIndex,
        inputWrapperRef,
        childFocusIndex,
        firstOptionIndex,
        isButtonDisabled,
        multiLevelDropdown,
        onBackFocusToParent,
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
        if (creatable && focusedIndex === 0 && cachedRef.current.newOptionLabel && !isButtonDisabled(cachedRef.current.newOptionLabel)) {
          onCreate(cachedRef.current.newOptionLabel);
          swallowEvent(null, true)(e);
        } else if ((!isInput || inputWrapperRef.contains(e.target)) && (!creatable || focusedIndex > 0)) {
          onSelect(cachedRef.current.getOptionValue(flatOptions[focusedIndex - firstOptionIndex]));
          swallowEvent(null, true)(e);
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
      } else if (!isInput && multiLevelDropdown && options?.[focusedIndex]?.options?.length && e.key === KeyCodes.ARROW_RIGHT) {
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

      if (e.target !== inputWrapperRef && !inputWrapperRef.contains(e.target) && !menuRef.current.contains(e.target)) {
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

  return (
    <Portal portalNode={document.body}>
      <Popper placement={placement} modifiers={popoverModifiers}>
        {({ ref, style }) => (
          <MenuPopoverContainer ref={ref} style={style} autoWidth={autoWidth} onMouseMove={onMouseMove}>
            <Menu
              ref={menuRef}
              fullWidth
              searchable={
                (creatable || menuSearchable) && (
                  <MenuHeader
                    onFocus={() => !cachedRef.current.blockOptionHover && onFocusItem(0)}
                    onCreate={onCreate}
                    searchLabel={searchLabel}
                    createInputRef={createInputRef}
                    menuSearchable={menuSearchable}
                    newOptionLabel={newOptionLabel}
                    focusedOptionRef={focusedOptionRef}
                    isButtonDisabled={isButtonDisabled}
                    updateSearchLabel={(value) => updateSearchLabel(formatValue ? formatValue(value) : value)}
                    focusedOptionIndex={focusedOptionIndex}
                    onChangeSearchLabel={onChangeSearchLabel}
                    createInputPlaceholder={createInputPlaceholder}
                  />
                )
              }
              scrollbarsRef={scrollbarsRef}
              disableAnimation={disableAnimation}
            >
              <MenuOptions
                onHide={onHide}
                options={options}
                grouped={grouped}
                onSelect={onSelect}
                autoWidth={autoWidth}
                onItemRef={onItemRef}
                searchLabel={searchLabel}
                optionsPath={optionsPath}
                onFocusItem={(index) => !cachedRef.current.blockOptionHover && onFocusItem(index)}
                onBackFocus={onBackFocus}
                getOptionKey={getOptionKey}
                getOptionLabel={getOptionLabel}
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
        )}
      </Popper>
    </Portal>
  );
}

export default SelectMenu;
