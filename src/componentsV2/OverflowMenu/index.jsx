import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';

import Container from './components/OverflowMenuContainer';

function OverflowMenu({ options, onSelect, disabled }) {
  return (
    <Dropdown options={options} onSelect={onSelect}>
      {(ref, onToggle) => (
        <Container disabled={disabled} onClick={onToggle} ref={ref}>
          <SvgIcon icon="elipsis" />
        </Container>
      )}
    </Dropdown>
  );
}

export default OverflowMenu;
