import { Checkbox, Dropdown, Menu, stopImmediatePropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { useKeygen } from '@/hooks';
import { ClassName } from '@/styles/constants';

import {
  Count,
  DropdownLabel,
  InnerContainer,
  Label,
  SectionLabel,
  TriggerContainer,
  ValueContainer,
} from './components';

function DropdownMultiselect({
  options = [],
  multiSectionOptions = null,
  multiSelectDisabled,
  component: Component,
  onSelect,
  menu,
  selfDismiss,
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
  isTranscript = false,
  customOptionLabelStyling,
  withCaret,
  searchable,
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
        menu ||
        ((onToggle) => (
          <Menu
            maxHeight={maxHeight}
            maxVisibleItems={maxVisibleItems}
            disabled={buttonDisabled}
            multiSelectProps={
              !multiSelectDisabled && {
                buttonClick: (e) => {
                  buttonClick?.(e, { onToggle });
                  if (selfDismiss) {
                    onToggle();
                  }
                },
                buttonLabel,
              }
            }
            searchable={searchable}
          >
            {dropdownOptions.map(({ sectionLabel, options }, index) => (
              <span key={index}>
                {sectionLabel && <SectionLabel>{sectionLabel}</SectionLabel>}
                {options.map(({ value, label, onClick }) => (
                  <Menu.Item
                    className={ClassName.MULTISELECT_ITEM}
                    key={genKey(value || label)}
                    onClick={stopImmediatePropagation(() => {
                      onClick?.();
                      onSelect?.(value);
                      if (selfDismiss) {
                        onToggle();
                      }
                    })}
                  >
                    {/* So weird, if u put the label inside the checkbox component, the menu item onclick will trigger twice on label click // */}
                    {/* (something to do with stopImmediateProp and the checkbox component) */}
                    {isTranscript ? (
                      <>
                        <DropdownLabel>{label}</DropdownLabel>
                      </>
                    ) : (
                      <>
                        <Checkbox readOnly checked={selectedItems.includes(value)} />
                        <Label style={customOptionLabelStyling}>{label || value.toString()}</Label>
                      </>
                    )}
                  </Menu.Item>
                ))}
              </span>
            ))}
          </Menu>
        ))
      }
      autoWidth={autoWidth}
      placement={placement}
    >
      {({ ref, onToggle, isOpen }) =>
        Component ? (
          <Component ref={ref} onClick={onToggle} />
        ) : (
          <TriggerContainer className={ClassName.MULTISELECT_DROPDOWN} ref={ref} onClick={onToggle}>
            <InnerContainer active={dropdownActive && isOpen}>
              {dropdownLabel && <Label>{dropdownLabel}</Label>}
              <ValueContainer className={ClassName.MULTISELECT_SELECTED_VALUE}>
                {selectedValue || <span>{placeholder}</span>}
              </ValueContainer>
              {withCaret ? (
                <SvgIcon icon="caretDown" size={10} color="#6e849a" />
              ) : (
                <Count>{selectedItems.length}</Count>
              )}
            </InnerContainer>
          </TriggerContainer>
        )
      }
    </Dropdown>
  );
}

export default DropdownMultiselect;
