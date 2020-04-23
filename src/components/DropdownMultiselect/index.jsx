import React from 'react';

import Checkbox from '@/components/Checkbox';
import Dropdown from '@/components/Dropdown';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import { useKeygen } from '@/hooks';
import { stopImmediatePropagation } from '@/utils/dom';

import { Count, InnerContainer, Label, SectionLabel, TriggerContainer, ValueContainer } from './components';

function DropdownMultiselect({
  options = [],
  multiSectionOptions = null,
  component: Component,
  onSelect,
  menu,
  selectedItems,
  buttonDisabled,
  buttonClick,
  buttonLabel,
  selectedValue,
  dropdownLabel,
  autoWidth,
  placement,
  maxHeight,
  maxVisibleItems,
  placeholder,
  dropdownActive,
  customOptionLabelStyling,
  withCaret,
}) {
  const genKey = useKeygen();

  const dropdownOptions = !multiSectionOptions
    ? [
        {
          sectionLabel: null,
          options,
        },
      ]
    : multiSectionOptions;

  return (
    <Dropdown
      maxHeight={maxHeight}
      maxVisibleItems={maxVisibleItems}
      menu={
        menu || (
          <Menu
            maxHeight={maxHeight}
            maxVisibleItems={maxVisibleItems}
            disabled={buttonDisabled}
            multiSelectProps={{ multiselect: true, buttonClick, buttonLabel }}
          >
            {dropdownOptions.map(({ sectionLabel, options }, index) => {
              return (
                <span key={index}>
                  {sectionLabel && <SectionLabel>{sectionLabel}</SectionLabel>}
                  {options.map(({ value, label, onClick }) => (
                    <MenuItem
                      key={genKey(value || label)}
                      onClick={stopImmediatePropagation(() => {
                        onClick?.();
                        onSelect?.(value);
                      })}
                    >
                      <Checkbox readOnly checked={selectedItems.includes(value)}>
                        <Label style={customOptionLabelStyling}>{label || value.toString()}</Label>
                      </Checkbox>
                    </MenuItem>
                  ))}
                </span>
              );
            })}
          </Menu>
        )
      }
      autoWidth={autoWidth}
      placement={placement}
    >
      {(ref, onToggle, isOpen) =>
        Component ? (
          <Component ref={ref} onClick={onToggle} />
        ) : (
          <TriggerContainer ref={ref} onClick={onToggle}>
            <InnerContainer active={dropdownActive && isOpen}>
              {dropdownLabel && <Label>{dropdownLabel}</Label>}
              <ValueContainer>{selectedValue || <span>{placeholder}</span>}</ValueContainer>
              {withCaret ? <SvgIcon icon="caretDown" size={10} color="#6e849a" /> : <Count>{selectedItems.length}</Count>}
            </InnerContainer>
          </TriggerContainer>
        )
      }
    </Dropdown>
  );
}

export default DropdownMultiselect;
