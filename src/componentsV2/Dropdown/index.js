import PropTypes from 'prop-types';
import React from 'react';

import DropdownMenu from '@/componentsV2/DropdownMenu';

import Component from './DropdownComponent';

function Dropdown({ icon, label, color, size, value, options, placeholder, onSelect, disabled, multiSelectProps, children }) {
  return (
    <DropdownMenu options={options} onSelect={onSelect} placement="bottom-start" multiSelectProps={multiSelectProps}>
      {(ref, onToggle, isOpen) => {
        return (
          <Component
            value={value}
            color={color}
            icon={icon}
            isOpen={isOpen}
            placeholder={placeholder}
            label={label}
            size={size}
            disabled={disabled}
            onToggle={onToggle}
            multiSelectProps={multiSelectProps}
            ref={ref}
          >
            {children}
          </Component>
        );
      }}
    </DropdownMenu>
  );
}

Dropdown.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  multiSelectProps: PropTypes.object,
  children: PropTypes.elementType,
};

Dropdown.defaultProps = {
  placeholder: 'Select option',
  multiSelectProps: {
    noAutoClose: false,
    multiSelect: false,
    selectedItems: [],
    buttonLabel: '',
    unSelectAll: null,
  },
};

export default Dropdown;
