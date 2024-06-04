import { Animations } from '@voiceflow/ui';
import { layout, LayoutProps, space, SpaceProps } from 'styled-system';

import { css, styled } from '@/hocs/styled';
import { LogoContainer } from '@/pages/Onboarding/Steps/Welcome/styles';

export interface ContainerProps extends SpaceProps, LayoutProps {
  focused?: boolean;
  rightAlign?: boolean;
  userSpeak?: boolean;
  isFirstInSeries?: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  position: relative;
  align-items: flex-end;
  margin-left: 45px;
  ${space}
  ${layout}

  ${({ focused }) =>
    focused &&
    css`
      opacity: 100% !important;
    `}

  ${({ isFirstInSeries }) =>
    !isFirstInSeries &&
    css`
      margin-top: 8px;
    `}

  ${({ userSpeak }) =>
    userSpeak &&
    css`
      margin: 24px 0px 24px 0px;
    `}

  ${({ rightAlign = false }) =>
    rightAlign
      ? css`
          flex-direction: row-reverse;
        `
      : css`
          max-width: 500px;
        `}
`;

interface BubbleProps {
  clickable?: boolean;
  isFirstInSeries?: boolean;
  rightAlign?: boolean;
  color?: string;
}

export const Bubble = styled.div<BubbleProps>`
  position: relative;
  max-width: 100%;
  padding: 12px 16px;
  overflow: hidden;
  color: #132144;
  text-align: left;
  word-break: break-word;
  font-size: 15px;
  border-radius: 10px;
  min-height: 45px;

  ::first-letter {
    text-transform: capitalize;
  }
  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
    `}

  ${({ rightAlign = false, color }) =>
    rightAlign
      ? css`
          background-color: ${color ?? '#3d81e2'};
          color: white;
        `
      : css`
          background-color: #f4f4f4;
        `}
`;

const ANIMATION_DURATION = 0.6;

const sharedAnimationProps = {
  duration: ANIMATION_DURATION,
  animationFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
};

export const FadeDown = styled.div<Animations.FadeInProps>`
  ${Animations.fadeAndMoveStyleFactory({ height: 10, ...sharedAnimationProps })}
`;

export const FadeUp = styled.div<Animations.FadeInProps>`
  ${Animations.fadeAndMoveStyleFactory({ height: -10, ...sharedAnimationProps })}
`;

export const DelayedFadeUp = styled.div<Animations.FadeInProps>`
  ${Animations.fadeAndMoveStyleFactory({ height: -10, delay: 0.3, ...sharedAnimationProps })}
`;

export const LogoCircle = styled(LogoContainer)`
  position: absolute;
  bottom: -16px;
  left: -45px;
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px rgba(19, 33, 68, 0.04);

  & > * {
    padding: 16px;
  }
`;
