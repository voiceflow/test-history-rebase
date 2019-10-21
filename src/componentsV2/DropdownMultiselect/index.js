import React from 'react';

import { useKeygen } from '@/components/KeyedComponent';
import Dropdown from '@/componentsV2/Dropdown';
import Menu, { MenuItem } from '@/componentsV2/Menu';
import { stopImmediatePropagation } from '@/utils/dom';

import { Checkbox, Count, InnerContainer, Label, TriggerContainer, ValueContainer } from './components';

function DropdownMultiselect({
  options = [],
  component: Component,
  onSelect,
  menu,
  selectedItems,
  buttonClick,
  buttonLabel,
  selectedValue,
  dropdownLabel,
  autoWidth,
  placement,
  placeholder,
}) {
  const genKey = useKeygen();

  return (
    <Dropdown
      menu={
        menu || (
          <>
            <Menu multiSelectProps={{ multiselect: true, buttonClick, buttonLabel }}>
              {options.map(({ value, label, onClick }) => (
                <MenuItem
                  key={genKey(value || label)}
                  onClick={stopImmediatePropagation(() => {
                    onClick && onClick();
                    onSelect && onSelect(value);
                  })}
                >
                  <Checkbox type="checkbox" readOnly checked={selectedItems.includes(value)} />
                  <Label>{label || value.toString()}</Label>
                </MenuItem>
              ))}
            </Menu>
          </>
        )
      }
      autoWidth={autoWidth}
      placement={placement}
    >
      {(ref, onToggle) =>
        Component ? (
          <Component ref={ref} onClick={onToggle} />
        ) : (
          <TriggerContainer ref={ref} onClick={onToggle}>
            <InnerContainer>
              {dropdownLabel && <Label>{dropdownLabel}</Label>}
              <ValueContainer>{selectedValue || <span>{placeholder}</span>}</ValueContainer>
              <Count>{selectedItems.length}</Count>
            </InnerContainer>
          </TriggerContainer>
        )
      }
    </Dropdown>
  );
}

export default DropdownMultiselect;
