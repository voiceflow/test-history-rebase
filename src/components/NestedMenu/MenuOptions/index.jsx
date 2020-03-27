/* eslint-disable import/no-cycle */
import React from 'react';
import { Manager, Reference } from 'react-popper';

import { stopPropagation } from '@/utils/dom';

import Menu from '../Menu';
import { SelectItem, SubLevelIcon } from './components';

function MenuOptions({
  onHide,
  options,
  grouped,
  onSelect,
  autoWidth,
  onItemRef,
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
  multiLevelDropdown,
  childFocusItemIndex,
  onChildFocusItemIndex,
  portalNode,
}) {
  let groupedIndex = 0;

  const renderOptions = (options, optionsPath) =>
    options.map((option, i) => {
      let index = i + firstOptionIndex;

      if (grouped) {
        index = firstOptionIndex + groupedIndex++;
      }

      if (multiLevelDropdown && !!option.options?.length) {
        return (
          <Manager key={getOptionKey(option)}>
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
                placement="right-start"
                searchLabel={searchLabel}
                optionsPath={[...optionsPath, i]}
                getOptionKey={getOptionKey}
                onFocusOption={onChildFocusItemIndex}
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                inputWrapperRef={inputWrapperRef}
                disableAnimation
                popoverModifiers={popoverModifiers}
                renderOptionLabel={renderOptionLabel}
                focusedOptionIndex={childFocusItemIndex}
                multiLevelDropdown={!!option.options}
                onBackFocusToParent={onBackFocus}
                portalNode={portalNode}
              />
            )}
          </Manager>
        );
      }

      return (
        <SelectItem
          key={getOptionKey(option)}
          ref={onItemRef(index)}
          onClick={stopPropagation(() => onSelect(getOptionValue(option), [...optionsPath, i]))}
          isNested={grouped}
          isFocused={focusedOptionIndex === index}
          onMouseEnter={() => onFocusItem?.(index)}
        >
          {renderOptionLabel(option, searchLabel, getOptionLabel, getOptionValue, {
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
