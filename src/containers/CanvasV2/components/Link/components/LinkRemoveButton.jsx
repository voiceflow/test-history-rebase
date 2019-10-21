import React from 'react';

import IconButton from '@/componentsV2/IconButton';
import IconButtonContainer from '@/componentsV2/IconButton/components/IconButtonContainer';
import { styled, transition } from '@/hocs';

const LINK_SIZE = 52;

const LinkRemoveButton = ({ x, y, onClick, isHovering, ...props }) => (
  <foreignObject width={LINK_SIZE} height={LINK_SIZE} x={x - LINK_SIZE / 2} y={y - LINK_SIZE / 2} {...props}>
    <IconButton icon="trash" size={15} onClick={onClick} />
  </foreignObject>
);

export default styled(LinkRemoveButton)`
  position: relative;
  visibility: ${({ isHovering }) => (isHovering ? 'visible' : 'hidden')};

  & > ${IconButtonContainer} {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 42px;
    height: 42px;
    background: #fff;
    pointer-events: auto;
    opacity: 1;
    ${transition()}
  }
`;
