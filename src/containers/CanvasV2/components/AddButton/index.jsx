import React from 'react';
import { Tooltip } from 'react-tippy';

import { stopPropagation } from '@/utils/dom';

import { Container, Icon } from './components';

function BlockAddButton({ disableTooltip, onClick, children, tooltip }) {
  return (
    <Container onMouseDown={stopPropagation()} onWheel={stopPropagation()} column>
      <Tooltip disabled={disableTooltip} distance={10} position="bottom" title={tooltip}>
        <Icon icon="plus" onClick={onClick} />
      </Tooltip>
      {children}
    </Container>
  );
}

export default BlockAddButton;
