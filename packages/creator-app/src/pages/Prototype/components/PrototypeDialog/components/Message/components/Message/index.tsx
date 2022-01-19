import { Nullable } from '@voiceflow/common';
import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { AnyStyledComponent } from 'styled-components';

import Avatar from '@/components/Avatar';
import { PMStatus } from '@/pages/Prototype/types';
import { ClassName } from '@/styles/constants';

import Bubble from '../MessageBubble';
import Container from '../MessageContainer';
import { LogoCircle, MessageFadeUpContainer } from './components';

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
  animationDelay?: number;
  animationContainer?: AnyStyledComponent;
  isLastInSeries?: boolean;
  isLastBotMessage?: boolean;
  isLastBubble?: boolean;
  isLoading?: boolean;
  forceIcon?: boolean;
  pmStatus: Nullable<PMStatus>;
}

const Message: React.FC<MessageProps> = ({
  rightAlign,
  isFirstInSeries,
  children,
  withLogo = true,
  onClick,
  startTime,
  withAnimation = true,
  isLast,
  color,
  bubble = true,
  avatarURL,
  className,
  focused = false,
  isLastInSeries = false,
  animationContainer = MessageFadeUpContainer,
  isLastBotMessage,
  isLoading,
  forceIcon,
  pmStatus,
  isLastBubble,
  ...props
}) => {
  const InnerContainer = React.useMemo(() => (withAnimation ? animationContainer : React.Fragment), []);
  const hideIcon = pmStatus === PMStatus.FAKE_LOADING && isLastBubble;
  const showIconLogo = forceIcon || (withLogo && isLastInSeries && !hideIcon);

  return (
    <Container focused={focused} className={cn(ClassName.CHAT_DIALOG_MESSAGE, className)} rightAlign={rightAlign} {...props}>
      <InnerContainer>
        {showIconLogo && (
          <LogoCircle shadow={false} size={32} forAvatar={!!avatarURL}>
            {avatarURL ? (
              <Avatar className={ClassName.PROTOTYPE_MESSAGE_ICON} noHover noShadow url={avatarURL} />
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
