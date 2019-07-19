import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import DropdownMenu from '@/componentsV2/DropdownMenu';
import EllipsisIcon from '@/svgs/elipsis.svg';

import Container from './components/OverflowMenuContainer';

function OverflowMenu({ options, onSelect, disabled }) {
  return (
    <DropdownMenu options={options} onSelect={onSelect}>
      {(ref, onToggle) => (
        <Container disabled={disabled} onClick={onToggle} ref={ref}>
          <SvgIcon icon={EllipsisIcon} />
        </Container>
      )}
    </DropdownMenu>
  );
}

export default OverflowMenu;
