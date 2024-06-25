import BaseMenu from '@ui/components/Menu';
import type { PopperProps } from '@voiceflow/legacy-react-popper';
import React from 'react';

import defaultMenuLabelRenderer from './defaultMenuLabelRenderer';
import Menu, { DEFAULT_PATH } from './Menu';
import type { NestedMenuInternalProps, NestedMenuMultilevelProps, NestedMenuWithIDMultilevelProps } from './Menu/types';
import MenuOptions from './MenuOptions';
import OptionContainer from './OptionContainer';
import type { MenuItemMultilevel, MenuItemWithID, RenderOptionLabel } from './types';

export { getFormattedLabel as getNestedMenuFormattedLabel } from './getFormattedLabel';
export { defaultMenuLabelRenderer };
export * from './types';
export * from './utils';

export const POPOVER_MODIFIERS: PopperProps['modifiers'] = {
  hide: { enabled: false },
  autoSizing: { enabled: true, fn: undefined, order: 840 },
  preventOverflow: { enabled: true, boundariesElement: globalThis.document?.body },
};

interface ExtraProps<Option, Value> {
  maxVisibleItems?: number;
  renderOptionLabel?: RenderOptionLabel<Option, Value>;
}

type ExcludedProps = 'isMultiLevel' | 'grouped' | 'renderOptionLabel';

/* this component can be used in a Popper w/o Manager
 * (e.g. Canvas ContextMenu component implementation)
 */

function NestedMenu<Option extends MenuItemMultilevel<Option>, Value = Option>(
  props: ExtraProps<Option, Value> & Omit<NestedMenuMultilevelProps<Option, Value>, ExcludedProps>
): React.ReactElement;
function NestedMenu<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value = Option>(
  props: ExtraProps<Option, Value> & Omit<NestedMenuWithIDMultilevelProps<Option, Value>, ExcludedProps>
): React.ReactElement;
function NestedMenu({
  isRoot,
  options,
  onSelect,
  getOptionKey,
  maxVisibleItems,
  popoverModifiers = POPOVER_MODIFIERS,
  renderOptionLabel = defaultMenuLabelRenderer,
  ...props
}: ExtraProps<MenuItemMultilevel<any>, any> &
  Omit<NestedMenuInternalProps, 'options' | ExcludedProps> & {
    options: MenuItemMultilevel<any>[];
  }): React.ReactElement {
  const [childFocusItemIndex, setChildFocusItemIndex] = React.useState<number | null>(null);
  const [focusedOptionIndex, updateFocusedOptionIndex] = React.useState<number | null>(null);

  const onFocusItem = (index: number) => updateFocusedOptionIndex(index);

  const onChildFocusItemIndex = (index: number) => {
    const nestedOptionsLength = focusedOptionIndex === null ? 0 : options[focusedOptionIndex]?.options?.length || 0;

    const focusedIndex = index >= nestedOptionsLength ? 0 : index;

    setChildFocusItemIndex(focusedIndex < 0 ? nestedOptionsLength - 1 : focusedIndex);
  };

  return (
    <BaseMenu fullWidth maxVisibleItems={maxVisibleItems}>
      <MenuOptions
        options={options}
        onSelect={onSelect}
        onFocusItem={onFocusItem}
        optionsPath={DEFAULT_PATH}
        isMultiLevel
        getOptionKey={getOptionKey as any}
        firstOptionIndex={0}
        popoverModifiers={popoverModifiers}
        renderOptionLabel={renderOptionLabel}
        focusedOptionIndex={focusedOptionIndex}
        childFocusItemIndex={childFocusItemIndex}
        onChildFocusItemIndex={onChildFocusItemIndex}
        {...props}
      />
    </BaseMenu>
  );
}

export default Object.assign(NestedMenu, {
  labelRenderer: defaultMenuLabelRenderer,

  Menu,
  OptionContainer,
});
