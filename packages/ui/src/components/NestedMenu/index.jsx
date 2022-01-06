import BaseMenu from '@ui/components/Menu';
import { setRef } from '@ui/utils';
import React from 'react';

import defaultMenuLabelRenderer from './defaultMenuLabelRenderer';
import AdvancedMenu, { DEFAULT_PATH } from './Menu';
import { FooterActionContainer } from './Menu/components';
import MenuHeader from './MenuHeader';
import MenuOptions from './MenuOptions';

export const NestedMenuComponents = { FooterActionContainer };

export { getFormattedLabel as getNestedMenuFormattedLabel } from './getFormattedLabel';
export { FooterActionContainer } from './Menu/components';
export { AdvancedMenu, defaultMenuLabelRenderer, MenuHeader, MenuOptions };

const defaultGetter = (option) => option;

export const POPOVER_MODIFIERS = {
  hide: { enabled: false },
  autoSizing: { enabled: true, fn: null, order: 840 },
  preventOverflow: { enabled: true, boundariesElement: document.body },
};

/* this component can be used in a Popper w/o Manager
 * (e.g. Canvas ContextMenu component implementation)
 */
const SimpleNestedMenu = ({
  options,
  onSelect,
  grouped,
  multiLevelDropdown = true,
  maxVisibleItems,
  getOptionValue = defaultGetter,
  getOptionLabel = defaultGetter,
  getOptionKey = getOptionValue,
  popoverModifiers = POPOVER_MODIFIERS,
  renderOptionLabel = defaultMenuLabelRenderer,
  ...props
}) => {
  const firstOptionIndex = 0;
  const [focusedOptionIndex, updateFocusedOptionIndex] = React.useState(multiLevelDropdown ? null : 0);
  const [childFocusItemIndex, setChildFocusItemIndex] = React.useState(null);
  const focusedItemOptions = options[focusedOptionIndex - firstOptionIndex]?.options;
  const onItemRef = (_, ref) => (node) => setRef(ref, node);
  const onFocusItem = React.useCallback((index) => updateFocusedOptionIndex(index), [updateFocusedOptionIndex]);
  const onChildFocusItemIndex = React.useCallback(
    (index) => {
      const focusedIndex = index >= focusedItemOptions.length ? 0 : index;

      setChildFocusItemIndex(focusedIndex < 0 ? focusedItemOptions.length - 1 : focusedIndex);
    },
    [focusedItemOptions, firstOptionIndex]
  );

  return (
    <BaseMenu fullWidth maxVisibleItems={maxVisibleItems}>
      <MenuOptions
        options={options}
        onSelect={onSelect}
        onItemRef={onItemRef}
        onFocusItem={onFocusItem}
        optionsPath={DEFAULT_PATH}
        getOptionKey={getOptionKey}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        firstOptionIndex={firstOptionIndex}
        popoverModifiers={popoverModifiers}
        renderOptionLabel={renderOptionLabel}
        focusedOptionIndex={focusedOptionIndex}
        multiLevelDropdown={multiLevelDropdown}
        childFocusItemIndex={childFocusItemIndex}
        onChildFocusItemIndex={onChildFocusItemIndex}
        {...props}
      />
    </BaseMenu>
  );
};

export default SimpleNestedMenu;
