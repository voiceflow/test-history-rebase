/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';

import Dropdown from '@/components/Dropdown';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';

import Container from './components/OverflowMenuContainer';

function OverflowMenu({ options, onSelect, disabled, placement }) {
  return (
    <Dropdown
      {...(onSelect
        ? { onSelect, options }
        : {
            menu: (
              <Menu>
                {options.map(({ onClick, label }, index) => (
                  <MenuItem key={index} onClick={onClick}>
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            ),
          })}
      placement={placement}
    >
      {(ref, onToggle) => (
        <Container disabled={disabled} onClick={onToggle} ref={ref}>
          <SvgIcon icon="elipsis" />
        </Container>
      )}
    </Dropdown>
  );
}

export default OverflowMenu;
