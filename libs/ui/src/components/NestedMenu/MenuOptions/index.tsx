import composeRef from '@seznam/compose-react-refs';
import TippyTooltip from '@ui/components/TippyTooltip';
import { ClassName } from '@ui/styles/constants';
import { stopImmediatePropagation } from '@ui/utils';
import { Manager, Reference } from '@voiceflow/legacy-react-popper';
import React from 'react';

// eslint-disable-next-line import/no-cycle
import Menu from '../Menu';
import type {
  GetOptionKey,
  MenuItemGrouped,
  MenuItemMultilevel,
  MenuItemWithID,
  RenderOptionLabelConfig,
} from '../types';
import { isBaseMenuItem, isGroupedOptions, isMenuItemMultilevel, isMenuItemWithID } from '../utils';
import { GroupHeader, SelectItem, SubLevelIcon } from './components';
import type {
  MenuOptionsGroupedProps,
  MenuOptionsInternalProps,
  MenuOptionsMultilevelProps,
  MenuOptionsProps,
  MenuOptionsWithIDGroupedProps,
  MenuOptionsWithIDMultilevelProps,
  MenuOptionsWithIDProps,
} from './types';

function MenuOptions<Option extends MenuItemWithID, Value = Option>(
  props: MenuOptionsWithIDProps<Option, Value>
): React.ReactElement;
function MenuOptions<Option, GroupedOption extends MenuItemGrouped<Option>, Value = Option>(
  props: MenuOptionsGroupedProps<Option, GroupedOption, Value>
): React.ReactElement;
function MenuOptions<Option extends MenuItemMultilevel<Option>, Value = Option>(
  props: MenuOptionsMultilevelProps<Option, Value>
): React.ReactElement;
function MenuOptions<Option extends MenuItemWithID, GroupedOption extends MenuItemGrouped<Option>, Value = Option>(
  props: MenuOptionsWithIDGroupedProps<Option, GroupedOption, Value>
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
  searchable,
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

    return empty ? (
      <SelectItem readOnly isEmpty>
        {empty}
      </SelectItem>
    ) : null;
  }

  const renderLabel = (option: unknown, config: RenderOptionLabelConfig): React.ReactNode =>
    renderOptionLabel(option, searchLabel, getOptionLabel, getOptionValue, { ...config, close: onHide });

  const renderOption = ({
    key,
    path,
    index,
    option,
  }: {
    key: string;
    path: number[];
    index: number;
    option: unknown;
  }) => {
    const isFocused = focusedOptionIndex === index;
    const isSelectable = !isBaseMenuItem(option) || (!option.disabled && !option.readOnly);

    const sharedProps = {
      ref: isFocused ? onItemRef?.(index) : null,
      active: isFocused,
      // to prevent parent popper from closing onSelect
      onClick: stopImmediatePropagation(() => isSelectable && onSelect(getOptionValue(option), path, updatePosition)),
      isNested: grouped,
      className: ClassName.MENU_ITEM,
      searchable,
      onMouseEnter: () => onFocusItem?.(index),
    };

    if (isBaseMenuItem(option) && option.groupHeader) {
      return <GroupHeader isSmall>{renderLabel(option, { isFocused, optionsPath: path })}</GroupHeader>;
    }

    if (isBaseMenuItem(option)) {
      const item = (
        <SelectItem
          key={key}
          {...sharedProps}
          {...option.menuItemProps}
          disabled={option.disabled}
          readOnly={option.readOnly}
        >
          {(!option.vfUIOnly || option.isEmpty) && renderLabel(option, { isFocused, optionsPath: path })}
        </SelectItem>
      );

      return option.tooltip ? (
        <TippyTooltip key={key} {...option.tooltip}>
          {item}
        </TippyTooltip>
      ) : (
        item
      );
    }

    return (
      <SelectItem key={key} {...sharedProps}>
        {renderLabel(option, { isFocused, optionsPath: path })}
      </SelectItem>
    );
  };

  let groupedIndex = 0;
  const renderOptions = (options: any[], optionsPath: number[]) =>
    options.map((option, indx) => {
      const key = (isMenuItemWithID(option) ? option.id : getOptionKey?.(option, indx)) || String(indx);
      const index = firstOptionIndex + (grouped ? groupedIndex++ : indx);

      const path = [...optionsPath, indx];
      const isFocused = focusedOptionIndex === index;

      if ((isMenuItemMultilevel(!!isMultiLevel, option) && !!option.options?.length) || option?.render) {
        return (
          <Manager key={key}>
            <Reference>
              {({ ref }) => (
                <SelectItem
                  ref={composeRef(ref, isFocused ? onItemRef?.(index) : null)}
                  active={isFocused}
                  withSubLevel
                  onMouseEnter={() => onFocusItem?.(index)}
                >
                  {renderOptionLabel(option, searchLabel, getOptionLabel, getOptionValue, {
                    isFocused,
                    optionsPath: path,
                  })}

                  <SubLevelIcon />
                </SelectItem>
              )}
            </Reference>

            {isFocused &&
              (option.render ? (
                option.render?.()
              ) : (
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
              ))}
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
              {option.label && <GroupHeader>{option.label}</GroupHeader>}

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
