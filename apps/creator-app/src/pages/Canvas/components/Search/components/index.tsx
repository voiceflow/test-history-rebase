import { SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { components, ControlProps, InputProps, MenuProps } from 'react-select';

import { styled } from '@/hocs/styled';

export { default as Container } from './SearchContainer';
export { default as Dropdown } from './SearchDropdown';
export { default as Option } from './SearchOption';
export { searchSelectFactory, default as Select } from './SearchSelect';

export const Control: React.FC<ControlProps<any, any>> = ({ children, ...props }) => (
  <components.Control {...props}>
    <SvgIcon icon="search" color="#F2F7F7D9" mr={12} />
    {children}
  </components.Control>
);

const NothingFound = styled.div`
  height: 52px;
  font-size: 13px;
  background-color: #4b5052;
  text-align: center;
  line-height: 52px;
  color: #f2f7f780;
`;

// omit onBlur to prevent resetting value
export const Input: React.FC<InputProps<any>> = ({ onBlur, ...props }) => <components.Input {...props} />;

export const Menu: React.FC<MenuProps<any, false>> = ({ children, ...props }) =>
  props.options.length ? <components.Menu {...props}>{children}</components.Menu> : <NothingFound>Nothing found</NothingFound>;
