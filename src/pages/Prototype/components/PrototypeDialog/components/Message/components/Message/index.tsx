import cn from 'classnames';
import React from 'react';

import Avatar from '@/components/Avatar';
import SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { FadeDownContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';

import Bubble from '../MessageBubble';
import Container from '../MessageContainer';
import { LogoCircle } from './components';

export type MessageProps = {
  onClick?: React.MouseEventHandler;
  startTime?: string;
  rightAlign?: boolean;
  withLogo?: boolean;
  isFirstInSeries?: boolean;
  userSpeak?: boolean;
  withAnimation?: boolean;
  isLast?: boolean;
  bubble?: boolean;
  color?: string;
  avatarURL?: string;
  className?: string;
};

const Message: React.FC<MessageProps> = ({
  rightAlign,
  isFirstInSeries,
  children,
  withLogo = true,
  onClick,
  startTime,
  withAnimation = false,
  isLast,
  color,
  bubble = true,
  avatarURL,
  className,
  ...props
}) => {
  const InnerContainer = React.useMemo(() => (!rightAlign && isFirstInSeries && !withAnimation ? React.Fragment : FadeDownContainer), []);

  return (
    <Container className={cn(ClassName.CHAT_DIALOG_MESSAGE, className)} rightAlign={rightAlign} {...props}>
      <InnerContainer>
        {withLogo && isFirstInSeries && (
          <LogoCircle shadow={false} size={32} forAvatar={!!avatarURL}>
            {avatarURL ? <Avatar noHover noShadow url={avatarURL} name="" color="red" /> : <SvgIcon icon="voiceflowV" size={16} color="black" />}
          </LogoCircle>
        )}

        <TippyTooltip distance={8} position="top" title={startTime} disabled={!startTime}>
          {bubble ? (
            <Bubble rightAlign={rightAlign} color={color} onClick={onClick} clickable={!!onClick} isFirstInSeries={isFirstInSeries}>
              {children}
            </Bubble>
          ) : (
            children
          )}
        </TippyTooltip>
      </InnerContainer>
    </Container>
  );
};

export default Message;
