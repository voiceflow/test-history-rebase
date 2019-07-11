import SvgIcon from 'components/SvgIcon';
import React from 'react';
import EllipsisIcon from 'svgs/elipsis.svg';

import Container from './components/OverflowMenuContainer';

function OverflowMenu(props) {
  return (
    <Container {...props}>
      <SvgIcon icon={EllipsisIcon} />
    </Container>
  );
}

export default OverflowMenu;
