import { css, keyframes, styled } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';
import { space, SpaceProps } from 'styled-system';

const fadeKeyframes = (distance = 0, height = 0) => keyframes`
  from {
    transform: translate3d(${distance}px, ${height}px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

export interface FadeProps {
  delay?: number;
  height?: number;
  distance?: number;
  duration?: number;
  animationFunction?: string;
}

export const getAnimationStyles =
  ({
    delay: defaultDelay = 0,
    height: defaultHeight = 0,
    distance: defaultDistance = 0,
    duration: defaultDuration = ANIMATION_SPEED,
    animationFunction: defaultAnimationFunction = 'ease-in-out',
  }: FadeProps = {}) =>
  ({
    delay = defaultDelay,
    height = defaultHeight,
    distance = defaultDistance,
    duration = defaultDuration,
    animationFunction = defaultAnimationFunction,
  }: FadeProps) =>
    css`
      /* stylelint-disable-next-line */
      animation: ${fadeKeyframes(distance, height)} ${duration}s ${animationFunction};
      animation-delay: ${delay}s;
      animation-fill-mode: both;
      /* stylelint-disable-next-line */
    `;

export const Fade = css<FadeProps>`
  ${getAnimationStyles()}
`;

export const FadeLeft = css<Omit<FadeProps, 'height'>>`
  ${getAnimationStyles({ distance: 40 })}
`;

export const FadeRight = css<Omit<FadeProps, 'height'>>`
  ${getAnimationStyles({ distance: -40 })}
`;

export const FadeDown = css<Omit<FadeProps, 'distance'>>`
  ${getAnimationStyles({ height: 8 })}
`;

export const FadeDownDelayed = css<Omit<FadeProps, 'distance'>>`
  ${getAnimationStyles({ height: 8, delay: ANIMATION_SPEED })}
`;

export const FadeUp = css<Omit<FadeProps, 'distance'>>`
  ${getAnimationStyles({ height: -8 })}
`;

export const FadeUpDelayed = css<Omit<FadeProps, 'distance'>>`
  ${getAnimationStyles({ height: -8, delay: ANIMATION_SPEED })}
`;

export const FadeContainer = styled.div<FadeProps & SpaceProps>`
  ${space}
  ${Fade}
`;

export const FadeLeftContainer = styled.div<Omit<FadeProps, 'height'> & SpaceProps>`
  ${space}
  ${FadeLeft}
`;

export const FadeRightContainer = styled.div<Omit<FadeProps, 'height'> & SpaceProps>`
  ${space}
  ${FadeRight}
`;

export const FadeDownContainer = styled.div<Omit<FadeProps, 'distance'> & SpaceProps>`
  ${space}
  ${FadeDown}
`;

export const FadeDownDelayedContainer = styled.div<Omit<FadeProps, 'distance'> & SpaceProps>`
  ${space}
  ${FadeDownDelayed}
`;

export const FadeUpContainer = styled.div<Omit<FadeProps, 'distance'> & SpaceProps>`
  ${space}
  ${FadeUp}
`;

export const FadeUpDelayedContainer = styled.div<Omit<FadeProps, 'distance'> & SpaceProps>`
  ${space}
  ${FadeUpDelayed}
`;
