import PropTypes from 'prop-types';
import React from 'react';

import DropdownMenu from '@/componentsV2/DropdownMenu';

import Component from './DropdownComponent';

function Dropdown({ icon, label, color, size, value, options, placeholder, onSelect, disabled, children }) {
  return (
    <DropdownMenu options={options} onSelect={onSelect} placement="bottom-start">
      {(ref, onToggle, isOpen) => {
        return (
          <Component
            value={value}
            color={color}
            icon={icon}
            size={size}
            isOpen={isOpen}
            placeholder={placeholder}
            label={label}
            disabled={disabled}
            onToggle={onToggle}
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
  children: PropTypes.elementType,
};

Dropdown.defaultProps = {
  placeholder: 'Select option',
};

export default Dropdown;
