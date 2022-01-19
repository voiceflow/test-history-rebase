import { css, styled } from '@/hocs';
import { LogoContainer } from '@/pages/Onboarding/Steps/Welcome/components';
import { FadeProps, getAnimationStyles } from '@/styles/animations';

interface LogoCircleProps {
  forAvatar?: boolean;
}

const ANIMATION_DURATION = 0.6;

const sharedAnimationProps = {
  duration: ANIMATION_DURATION,
  animationFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
};

const MessageFadeDown = css<FadeProps>`
  ${getAnimationStyles({ height: 10, ...sharedAnimationProps })}
`;

const MessageFadeUp = css<FadeProps>`
  ${getAnimationStyles({ height: -10, ...sharedAnimationProps })}
`;

const DelayedMessageFadeUp = css<FadeProps>`
  ${getAnimationStyles({ height: -10, delay: 0.3, ...sharedAnimationProps })}
`;

export const MessageFadeDownContainer = styled.div`
  ${MessageFadeDown}
`;

export const MessageFadeUpContainer = styled.div`
  ${MessageFadeUp}
`;

export const DelayedMessageFadeUpContainer = styled.div`
  ${DelayedMessageFadeUp}
`;

// eslint-disable-next-line import/prefer-default-export
export const LogoCircle = styled(LogoContainer)<LogoCircleProps>`
  position: absolute;
  bottom: -14px;
  left: -45px;
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(19, 33, 68, 0.04);

  ${({ forAvatar }) =>
    forAvatar &&
    css`
      & > * {
        padding: 16px;
      }
    `}
`;
