import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Count, DropdownButton, Icon, InnerContainer, Label, MultiSelectDropdown, Toggle } from './components';

const DropdownComponent = (
  { disabled, icon, color, size, placeholder, label, onToggle, isOpen, value, multiSelectProps: { multiSelect, selectedItems } },
  ref
) => {
  return (
    <Container width={size} ref={ref} onClick={onToggle} active={isOpen} color={color} inline>
      <InnerContainer>
        {icon && (
          <Icon>
            <SvgIcon icon={icon} color={color} />
          </Icon>
        )}
        {label && <Label>{label}</Label>}
        {multiSelect ? (
          <MultiSelectDropdown disabled={disabled} canHover={false}>
            {value ? <span>{value}</span> : placeholder}
          </MultiSelectDropdown>
        ) : (
          <DropdownButton disabled={disabled} canHover={false}>
            {value ? <span>{value}</span> : placeholder}
          </DropdownButton>
        )}
        {multiSelect ? (
          <Count>{selectedItems.length}</Count>
        ) : (
          <Toggle>
            <SvgIcon icon="caretDown" size={10} color="currentColor" />
          </Toggle>
        )}
      </InnerContainer>
    </Container>
  );
};

DropdownComponent.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  color: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onDismiss: PropTypes.func,
  onToggle: PropTypes.func,
  isOpen: PropTypes.bool,
  multiSelectProps: PropTypes.object,
  value: PropTypes.string,
  children: PropTypes.elementType,
};

DropdownComponent.defaultProps = {
  multiSelectProps: {
    multiSelect: false,
    selectedItems: [],
  },
};

export default React.forwardRef(DropdownComponent);
