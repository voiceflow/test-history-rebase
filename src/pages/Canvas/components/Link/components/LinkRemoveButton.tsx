import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { Container } from '@/components/IconButton/components';
import { styled, transition } from '@/hocs';

const LINK_SIZE = 52;

export type LinkRemoveButtonProps = {
  x: number;
  y: number;
  isHovering: boolean;
  onClick: React.MouseEventHandler;
  onMouseLeave: React.MouseEventHandler;
};

const LinkRemoveButton: React.FC<LinkRemoveButtonProps> = ({ x, y, onClick, isHovering, ...props }) => (
  <foreignObject width={LINK_SIZE} height={LINK_SIZE} x={x - LINK_SIZE / 2} y={y - LINK_SIZE / 2} {...props}>
    <IconButton icon="trash" size={16} onClick={onClick} variant={IconButtonVariant.NORMAL} />
  </foreignObject>
);

export default styled(LinkRemoveButton)`
  position: relative;
  visibility: ${({ isHovering }) => (isHovering ? 'visible' : 'hidden')};

  & > ${Container} {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 42px;
    height: 42px;
    transform: translate(-50%, -50%);
    opacity: 1;
    pointer-events: auto;
    ${transition()}
  }
`;
