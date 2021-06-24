import { IconButton, IconButtonContainer, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import { Point } from '@/types';

const LINK_SIZE = 52;

export type LinkRemoveButtonProps = {
  onClick: React.MouseEventHandler;
  position: Point;
  onMouseLeave: React.MouseEventHandler;
};

const LinkRemoveButton: React.FC<LinkRemoveButtonProps> = ({ position: [x, y], onClick, ...props }) => (
  <foreignObject width={LINK_SIZE} height={LINK_SIZE} x={x - LINK_SIZE / 2} y={y - LINK_SIZE / 2} {...props}>
    <IconButton icon="trash" size={16} onClick={onClick} variant={IconButtonVariant.NORMAL} />
  </foreignObject>
);

export default styled(LinkRemoveButton)`
  position: relative;

  & > ${IconButtonContainer} {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 42px;
    height: 42px;
    transform: translate(-50%, -50%);
    opacity: 1;
    pointer-events: auto;
  }
`;
