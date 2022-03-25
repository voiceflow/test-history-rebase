import composeRef from '@seznam/compose-react-refs';
import { ClassName } from '@ui/styles/constants';
import { stopImmediatePropagation } from '@ui/utils';
import React from 'react';
import { Manager, Reference } from 'react-popper';

// eslint-disable-next-line import/no-cycle
import Menu from '../Menu';
import { GetOptionKey, MenuItemGrouped, MenuItemMultilevel, MenuItemWithID, RenderOptionLabelConfig } from '../types';
import { isBaseMenuItem, isGroupedOptions, isMenuItemMultilevel, isMenuItemWithID } from '../utils';
import { SelectItem, SubLevelIcon } from './components';
import {
  MenuOptionsGroupedProps,
  MenuOptionsInternalProps,
  MenuOptionsMultilevelProps,
  MenuOptionsProps,
  MenuOptionsWithIDGroupedProps,
  MenuOptionsWithIDMultilevelProps,
  MenuOptionsWithIDProps,
} from './types';

function MenuOptions<Option extends MenuItemWithID, Value = Option>(props: MenuOptionsWithIDProps<Option, Value>): React.ReactElement;
function MenuOptions<Option extends MenuItemGrouped<Option>, Value = Option>(props: MenuOptionsGroupedProps<Option, Value>): React.ReactElement;
function MenuOptions<Option extends MenuItemMultilevel<Option>, Value = Option>(props: MenuOptionsMultilevelProps<Option, Value>): React.ReactElement;
function MenuOptions<Option extends MenuItemWithID & MenuItemGrouped<Option>, Value = Option>(
  props: MenuOptionsWithIDGroupedProps<Option, Value>
): React.ReactElement;
function MenuOptions<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value = Option>(
  props: MenuOptionsWithIDMultilevelProps<Option, Value>
): React.ReactElement;
function MenuOptions<Option, Value = Option>(props: MenuOptionsProps<Option, Value>): React.ReactElement;
function MenuOptions({
  onHide,
  options,
  grouped,
  onSelect,
  onItemRef,
  placement = 'right-start',
  onFocusItem,
  optionsPath,
  searchLabel = '',
  renderEmpty,
  isMultiLevel,
  getOptionKey,
  getOptionLabel,
  getOptionValue,
  updatePosition = () => undefined,
  firstOptionIndex,
  renderOptionLabel,
  focusedOptionIndex,
  childFocusItemIndex,
  onChildFocusItemIndex,
  ...menuProps
}: MenuOptionsInternalProps): React.ReactElement | null {
  if (!options.length && renderEmpty) {
    const empty = renderEmpty({ search: searchLabel, close: onHide });

    return empty ? <SelectItem disabled>{empty}</SelectItem> : null;
  }

  const renderLabel = (option: unknown, options: RenderOptionLabelConfig): React.ReactNode =>
    renderOptionLabel(option, searchLabel, getOptionLabel, getOptionValue, options);

  const renderOption = ({ key, path, index, option }: { key: string; path: number[]; index: number; option: unknown }) => {
    const isFocused = focusedOptionIndex === index;

    const sharedProps = {
      key,
      ref: isFocused ? onItemRef?.(index) : null,
      // to prevent parent popper from closing onSelect
      onClick: stopImmediatePropagation(
        () => (!isBaseMenuItem(option) || !option.disabled) && onSelect(getOptionValue(option), path, updatePosition)
      ),
      isNested: grouped,
      className: ClassName.MENU_ITEM,
      isFocused,
      onMouseEnter: () => onFocusItem?.(index),
    };

    if (isBaseMenuItem(option)) {
      return (
        <SelectItem {...sharedProps} {...option.menuItemProps} disabled={option.disabled}>
          {!option.vfUIOnly && renderLabel(option, { isFocused, optionsPath: path })}
        </SelectItem>
      );
    }

    return <SelectItem {...sharedProps}>{renderLabel(option, { isFocused, optionsPath: path })}</SelectItem>;
  };

  let groupedIndex = 0;
  const renderOptions = (options: unknown[], optionsPath: number[]) =>
    options.map((option, indx) => {
      const key = (isMenuItemWithID(option) ? option.id : getOptionKey?.(option, indx)) || String(indx);
      const index = firstOptionIndex + (grouped ? groupedIndex++ : indx);

      const path = [...optionsPath, indx];
      const isFocused = focusedOptionIndex === index;

      if (isMenuItemMultilevel(!!isMultiLevel, option) && !!option.options?.length) {
        return (
          <Manager key={key}>
            <Reference>
              {({ ref }) => (
                <SelectItem
                  ref={composeRef(ref, isFocused ? onItemRef?.(index) : null)}
                  isFocused={isFocused}
                  withSubLevel
                  onMouseEnter={() => onFocusItem?.(index)}
                >
                  {renderOptionLabel(option, searchLabel, getOptionLabel, getOptionValue, {
                    isFocused,
                    optionsPath: path,
                  })}

                  <SubLevelIcon icon="arrowRight" color="#BECEDC" size={10} />
                </SelectItem>
              )}
            </Reference>

            {isFocused && (
              <Menu
                isRoot={false}
                onHide={onHide}
                options={option.options ?? []}
                onSelect={onSelect}
                placement={placement}
                menuProps={option.menuProps}
                optionsPath={path}
                searchLabel={searchLabel}
                getOptionKey={getOptionKey as GetOptionKey<unknown>}
                isMultiLevel={!!option.options}
                onFocusOption={onChildFocusItemIndex}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                renderOptionLabel={renderOptionLabel}
                focusedOptionIndex={childFocusItemIndex}
                {...menuProps}
              />
            )}
          </Manager>
        );
      }

      return renderOption({ key, path, index, option });
    });

  if (isGroupedOptions(!!grouped, options)) {
    return (
      <>
        {options.map((option, index) =>
          option.options ? (
            <React.Fragment key={`${option.id}-${index}`}>
              <SelectItem as="div" isGroup className={ClassName.MENU_ITEM_GROUP}>
                {option.label}
              </SelectItem>

              {renderOptions(option.options, [...optionsPath, index])}
            </React.Fragment>
          ) : null
        )}
      </>
    );
  }

  return <>{renderOptions(options, optionsPath)}</>;
}

export default MenuOptions;
