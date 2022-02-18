import { ClassName } from '@ui/styles/constants';
import { stopImmediatePropagation } from '@ui/utils';
import React from 'react';
import { Manager, Reference } from 'react-popper';

// eslint-disable-next-line import/no-cycle
import Menu from '../Menu';
import { SelectItem, SubLevelIcon } from './components';

// eslint-disable-next-line sonarjs/cognitive-complexity
function MenuOptions({
  onHide,
  options,
  grouped,
  onSelect,
  autoWidth,
  onItemRef,
  placement,
  searchLabel,
  optionsPath,
  onFocusItem,
  onBackFocus,
  getOptionKey,
  getOptionLabel,
  getOptionValue,
  inputWrapperRef,
  firstOptionIndex,
  popoverModifiers,
  renderOptionLabel,
  focusedOptionIndex,
  updatePosition,
  multiLevelDropdown,
  childFocusItemIndex,
  onChildFocusItemIndex,
  portalNode,
  renderEmpty,
}) {
  let groupedIndex = 0;

  if (!options.length && renderEmpty) {
    const empty = renderEmpty({ search: searchLabel, close: onHide });

    return empty ? <SelectItem disabled>{empty}</SelectItem> : null;
  }

  // eslint-disable-next-line no-shadow
  const renderOptions = (options, optionsPath) =>
    options.map((option, i) => {
      let index = i + firstOptionIndex;
      const elementsKey = (option?.id ? getOptionKey(option.id, i) : getOptionKey(option, i)) || i;

      if (grouped) {
        index = firstOptionIndex + groupedIndex++;
      }

      if (multiLevelDropdown && !!option.options?.length) {
        return (
          <Manager key={elementsKey}>
            <Reference>
              {({ ref }) => (
                <SelectItem
                  ref={onItemRef(index, ref)}
                  isFocused={focusedOptionIndex === index}
                  withSubLevel
                  onMouseEnter={() => onFocusItem?.(index)}
                >
                  {renderOptionLabel(option, searchLabel, getOptionLabel, getOptionValue, {
                    isFocused: focusedOptionIndex === index,
                    optionsPath: [...optionsPath, i],
                  })}

                  <SubLevelIcon icon="arrowRight" color="#BECEDC" size={10} />
                </SelectItem>
              )}
            </Reference>

            {focusedOptionIndex === index && (
              <Menu
                isRoot={false}
                onHide={onHide}
                options={option.options}
                onSelect={onSelect}
                autoWidth={autoWidth}
                placement={placement || 'right-start'}
                searchLabel={searchLabel}
                optionsPath={[...optionsPath, i]}
                getOptionKey={getOptionKey}
                onFocusOption={onChildFocusItemIndex}
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                inputWrapperRef={inputWrapperRef}
                popoverModifiers={popoverModifiers}
                renderOptionLabel={renderOptionLabel}
                focusedOptionIndex={childFocusItemIndex}
                multiLevelDropdown={!!option.options}
                onBackFocusToParent={onBackFocus}
                portalNode={portalNode}
                menuProps={option.menuProps}
              />
            )}
          </Manager>
        );
      }

      return (
        <SelectItem
          className={ClassName.MENU_ITEM}
          key={elementsKey}
          ref={onItemRef(index)}
          // to prevent parent popper from closing onSelect
          onClick={stopImmediatePropagation(() => !option?.disabled && onSelect(getOptionValue(option), [...optionsPath, i], updatePosition))}
          isNested={grouped}
          disabled={option.disabled}
          isFocused={focusedOptionIndex === index}
          onMouseEnter={() => onFocusItem?.(index)}
          {...option.menuItemProps}
        >
          {!option.vfUIOnly &&
            renderOptionLabel(option, searchLabel, getOptionLabel, getOptionValue, {
              isFocused: focusedOptionIndex === index,
              optionsPath: [...optionsPath, i],
            })}
        </SelectItem>
      );
    });

  return grouped
    ? options.map((option, i) => (
        <React.Fragment key={`${option.label}-${i}`}>
          <SelectItem as="div" isGroup>
            {option.label}
          </SelectItem>

          {renderOptions(option.options, [...optionsPath, i])}
        </React.Fragment>
      ))
    : renderOptions(options, optionsPath);
}

export default MenuOptions;
