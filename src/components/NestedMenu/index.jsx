/* eslint-disable import/no-cycle */
import React from 'react';

import BaseMenu from '@/components/Menu';
import { setRef } from '@/components/Select/utils';

import AdvancedMenu, { DEFAULT_PATH } from './Menu';
import MenuHeader from './MenuHeader';
import MenuOptions from './MenuOptions';
import defaultLabelRenderer from './defaultLabelRenderer';

export { AdvancedMenu, MenuHeader, MenuOptions, defaultLabelRenderer };

const defaultGetter = (option) => option;
const POPOVER_MODIFIERS = { autoSizing: { enabled: true, fn: null, order: 840 }, preventOverflow: { enabled: false }, hide: { enabled: false } };

/* this component can be used in a Popper w/o Manager
 * (e.g. Canvas ContextMenu component implementation)
 */
const SimpleNestedMenu = ({
  options,
  onSelect,
  grouped,
  multiLevelDropdown = true,
  getOptionValue = defaultGetter,
  getOptionLabel = defaultGetter,
  getOptionKey = getOptionValue,
  renderOptionLabel = defaultLabelRenderer,
  ...props
}) => {
  const firstOptionIndex = 0;
  const menuRef = React.useRef();
  const [focusedOptionIndex, updateFocusedOptionIndex] = React.useState(multiLevelDropdown ? null : 0);
  const [childFocusItemIndex, setChildFocusItemIndex] = React.useState(null);
  const focusedItemOptions = options[focusedOptionIndex - firstOptionIndex]?.options;
  const menuPopoverModifiers = React.useMemo(() => POPOVER_MODIFIERS, []);
  const onItemRef = (_, ref) => (node) => setRef(ref, node);
  const onFocusItem = React.useCallback((index) => updateFocusedOptionIndex(index), [updateFocusedOptionIndex]);
  const onChildFocusItemIndex = React.useCallback(
    (index) => {
      const focusedIndex = index >= focusedItemOptions.length ? 0 : index;

      setChildFocusItemIndex(focusedIndex < 0 ? focusedItemOptions.length - 1 : focusedIndex);
    },
    [focusedItemOptions, firstOptionIndex] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <BaseMenu fullWidth ref={menuRef}>
      <MenuOptions
        options={options}
        onSelect={onSelect}
        onItemRef={onItemRef}
        onFocusItem={onFocusItem}
        optionsPath={DEFAULT_PATH}
        getOptionKey={getOptionKey}
        portalNode={menuRef?.current}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        firstOptionIndex={firstOptionIndex}
        popoverModifiers={menuPopoverModifiers}
        renderOptionLabel={renderOptionLabel}
        focusedOptionIndex={focusedOptionIndex}
        multiLevelDropdown={multiLevelDropdown}
        childFocusItemIndex={childFocusItemIndex}
        onChildFocusItemIndex={onChildFocusItemIndex}
        {...props}
      ></MenuOptions>
    </BaseMenu>
  );
};

export default SimpleNestedMenu;
