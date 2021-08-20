import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import Avatar from '@/components/Avatar';
import { FadeDownContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';

import Bubble from '../MessageBubble';
import Container from '../MessageContainer';
import { LogoCircle } from './components';

export interface MessageProps {
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
  focused?: boolean;
}

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
  focused = false,
  ...props
}) => {
  const InnerContainer = React.useMemo(() => (!rightAlign && isFirstInSeries && !withAnimation ? React.Fragment : FadeDownContainer), []);
  return (
    <Container focused={focused} className={cn(ClassName.CHAT_DIALOG_MESSAGE, className)} rightAlign={rightAlign} {...props}>
      <InnerContainer>
        {withLogo && isFirstInSeries && (
          <LogoCircle shadow={false} size={32} forAvatar={!!avatarURL}>
            {avatarURL ? (
              <Avatar className={ClassName.PROTOTYPE_MESSAGE_ICON} noHover noShadow url={avatarURL} name="" color="red" />
            ) : (
              <SvgIcon icon="voiceflowV" size={16} color="#fff" />
            )}
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
