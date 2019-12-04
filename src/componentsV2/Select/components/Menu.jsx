import _constant from 'lodash/constant';
import React from 'react';
import { Popper } from 'react-popper';

import Button from '@/components/Button';
import Menu from '@/componentsV2/Menu';
import Portal from '@/componentsV2/Portal';

import { MenuHeader, MenuHr, MenuInput, MenuPopoverContainer, SelectItem } from './styled';

const KeyCodes = {
  TAB: 'Tab',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
};

function SelectMenu({
  onHide,
  options,
  onSelect,
  onCreate,
  inputRef,
  creatable,
  autoWidth,
  placement,
  searchLabel,
  onFocusOption,
  getOptionValue,
  getOptionLabel,
  isButtonDisabled = _constant(false),
  popoverModifiers,
  renderOptionLabel,
  focusedOptionIndex,
  createInputPlaceholder,
}) {
  const cachedRef = React.useRef({ blockOptionHover: false, scrollToFocusedOption: true });
  const scrollbarsRef = React.useRef();
  const focusedOptionRef = React.useRef();
  const [newOptionLabel, updateSearchLabel] = React.useState(searchLabel);

  const onMouseMove = React.useCallback(() => {
    cachedRef.current.blockOptionHover = false;
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

  cachedRef.current = { ...cachedRef.current, focusedIndex: focusedOptionIndex, newOptionLabel };

  React.useEffect(() => {
    const keydownUp = (e) => {
      if (e.key === KeyCodes.ENTER || e.key === KeyCodes.TAB) {
        creatable && cachedRef.current.focusedIndex === 0
          ? cachedRef.current.newOptionLabel && !isButtonDisabled(cachedRef.current.newOptionLabel) && onCreate(cachedRef.current.newOptionLabel)
          : onSelect(options[cachedRef.current.focusedIndex - (creatable ? 1 : 0)]);
      } else if (e.key === KeyCodes.ESCAPE) {
        e.preventDefault();
        onHide();
      }
    };

    const keydownCallback = (e) => {
      cachedRef.current.blockOptionHover = true;
      cachedRef.current.scrollToFocusedOption = true;

      if (e.key === KeyCodes.ARROW_UP) {
        e.preventDefault();
        onFocusOption(cachedRef.current.focusedIndex - 1);
      } else if (e.key === KeyCodes.ARROW_DOWN) {
        e.preventDefault();
        onFocusOption(cachedRef.current.focusedIndex + 1);
      }
    };
    const clickCallback = (e) => {
      if (e.target !== inputRef && !scrollbarsRef.current.container.contains(e.target)) {
        onHide();
        e.stopPropagation();
      }
    };

    document.addEventListener('click', clickCallback);
    document.addEventListener('keyup', keydownUp);
    document.addEventListener('keydown', keydownCallback);

    return () => {
      document.removeEventListener('click', clickCallback);
      document.removeEventListener('keyup', keydownUp);
      document.removeEventListener('keydown', keydownCallback);
    };
  }, [onHide, inputRef, options, creatable, onCreate, onSelect, onFocusOption, isButtonDisabled]);

  return (
    <Portal>
      <Popper placement={placement} modifiers={popoverModifiers}>
        {({ ref, style }) => (
          <MenuPopoverContainer ref={ref} style={style} autoWidth={autoWidth} onMouseMove={onMouseMove}>
            <Menu
              searchable={
                creatable && (
                  <>
                    <MenuHeader
                      ref={focusedOptionIndex === 0 && focusedOptionRef}
                      isFocused={focusedOptionIndex === 0}
                      onMouseEnter={() => !cachedRef.current.blockOptionHover && onFocusOption(0)}
                    >
                      <MenuInput
                        value={newOptionLabel}
                        variant="inline"
                        onChange={({ target }) => updateSearchLabel(target.value)}
                        placeholder={createInputPlaceholder}
                      />

                      <Button
                        isBtn
                        onClick={() => onCreate(newOptionLabel)}
                        disabled={!newOptionLabel || isButtonDisabled(newOptionLabel)}
                        className="pointer"
                        isLinkLarge
                      >
                        Create
                      </Button>
                    </MenuHeader>

                    <MenuHr />
                  </>
                )
              }
              scrollbarsRef={scrollbarsRef}
            >
              {options.map((option, i) => {
                const index = i + (creatable ? 1 : 0);

                return (
                  <SelectItem
                    key={getOptionValue(option)}
                    ref={focusedOptionIndex === index && focusedOptionRef}
                    onClick={() => onSelect(getOptionValue(option))}
                    isFocused={focusedOptionIndex === index}
                    onMouseEnter={() => !cachedRef.current.blockOptionHover && onFocusOption(index)}
                  >
                    {renderOptionLabel(option, searchLabel, getOptionLabel, getOptionValue)}
                  </SelectItem>
                );
              })}
            </Menu>
          </MenuPopoverContainer>
        )}
      </Popper>
    </Portal>
  );
}

export const defaultOptionLabelRenderer = (option, searchLabel, getOptionLabel, getOptionValue) => {
  const label = getOptionLabel(getOptionValue(option));
  const substrs = searchLabel ? label.split(searchLabel) : [];

  return (
    <span>
      {substrs.length < 2
        ? label
        : substrs.map((str, i) =>
            i === 0 ? (
              str
            ) : (
              <React.Fragment key={`${str}${i}`}>
                <b>{searchLabel}</b>
                {str}
              </React.Fragment>
            )
          )}
    </span>
  );
};

export default SelectMenu;
