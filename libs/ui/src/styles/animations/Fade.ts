import { css, keyframes, styled } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';
import type { SpaceProps } from 'styled-system';
import { space } from 'styled-system';

import { moveInKeyframesFactory } from './Move';

export const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export interface FadeInProps {
  delay?: number;
  height?: number;
  distance?: number;
  duration?: number;
  animationFunction?: string;
}

export const fadeAndMoveStyleFactory =
  ({
    delay: defaultDelay = 0,
    height: defaultHeight = 0,
    distance: defaultDistance = 0,
    duration: defaultDuration = ANIMATION_SPEED,
    animationFunction: defaultAnimationFunction = 'ease-in-out',
  }: FadeInProps = {}) =>
  ({
    delay = defaultDelay,
    height = defaultHeight,
    distance = defaultDistance,
    duration = defaultDuration,
    animationFunction = defaultAnimationFunction,
  }: FadeInProps) => css`
    animation:
      ${fadeInKeyframes} ${duration}s ${animationFunction},
      ${moveInKeyframesFactory(distance, height)} ${duration}s ${animationFunction};
    animation-delay: ${delay}s;
    animation-fill-mode: both;
  `;

export const fadeInStyle = css<FadeInProps>`
  ${fadeAndMoveStyleFactory()}
`;

export const fadeInLeftStyle = css<Omit<FadeInProps, 'height'>>`
  ${fadeAndMoveStyleFactory({ distance: 40 })}
`;

export const fadeInRightStyle = css<Omit<FadeInProps, 'height'>>`
  ${fadeAndMoveStyleFactory({ distance: -40 })}
`;

export const fadeInDownStyle = css<Omit<FadeInProps, 'distance'>>`
  ${fadeAndMoveStyleFactory({ height: 8 })}
`;

export const fadeInDownDelayedStyle = css<Omit<FadeInProps, 'distance'>>`
  ${fadeAndMoveStyleFactory({ height: 8, delay: ANIMATION_SPEED })}
`;

export const fadeInUpStyle = css<Omit<FadeInProps, 'distance'>>`
  ${fadeAndMoveStyleFactory({ height: -8 })}
`;

export const fadeInUpDelayedStyle = css<Omit<FadeInProps, 'distance'>>`
  ${fadeAndMoveStyleFactory({ height: -8, delay: ANIMATION_SPEED })}
`;

export const Fade = styled.div<FadeInProps & SpaceProps>`
  ${space}
  ${fadeInStyle}
`;

export const FadeLeft = styled.div<Omit<FadeInProps, 'height'> & SpaceProps>`
  ${space}
  ${fadeInLeftStyle}
`;

export const FadeRight = styled.div<Omit<FadeInProps, 'height'> & SpaceProps>`
  ${space}
  ${fadeInRightStyle}
`;

export const FadeDown = styled.div<Omit<FadeInProps, 'distance'> & SpaceProps>`
  ${space}
  ${fadeInDownStyle}
`;

export const FadeDownDelayed = styled.div<Omit<FadeInProps, 'distance'> & SpaceProps>`
  ${space}
  ${fadeInDownDelayedStyle}
`;

export const FadeUp = styled.div<Omit<FadeInProps, 'distance'> & SpaceProps>`
  ${space}
  ${fadeInUpStyle}
`;

export const FadeUpDelayed = styled.div<Omit<FadeInProps, 'distance'> & SpaceProps>`
  ${space}
  ${fadeInUpDelayedStyle}
`;
