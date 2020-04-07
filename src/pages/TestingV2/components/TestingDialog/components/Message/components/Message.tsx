import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';

import Bubble from './MessageBubble';
import Container from './MessageContainer';

export type MessageProps = {
  onClick?: React.MouseEventHandler;
  startTime?: string;
  iconProps?: any;
  rightAlign?: boolean;
};

const Message: React.FC<MessageProps> = ({ rightAlign, children, iconProps, onClick, startTime, ...props }) => {
  return (
    <Container rightAlign={rightAlign} {...props}>
      {!!iconProps && <SvgIcon {...iconProps} size={16} />}

      <TippyTooltip title={startTime} disabled={!startTime}>
        <Bubble onClick={onClick} clickable={!!onClick}>
          {children}
        </Bubble>
      </TippyTooltip>
    </Container>
  );
};

export default Message;
