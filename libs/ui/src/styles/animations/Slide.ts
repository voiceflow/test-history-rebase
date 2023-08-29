import { css, styled } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';

import { fadeInKeyframes } from './Fade';
import { moveInTopKeyframes } from './Move';
import { scaleInYKeyframes } from './Scale';

export interface SlideInProps {
  delay?: number;
  origin?: string;
  duration?: number;
}

export const slideInStylesFactory =
  ({ delay: defaultDelay = 0, origin: defaultOrigin = 'top', duration: defaultDuration = ANIMATION_SPEED }: SlideInProps = {}) =>
  ({ delay = defaultDelay, origin = defaultOrigin, duration = defaultDuration }: SlideInProps) =>
    css`
      transform-origin: ${origin};
      animation: ${scaleInYKeyframes} ${duration}s ease-in-out, ${fadeInKeyframes} ${duration}s ease-in-out;
      animation-delay: ${delay}s;
      animation-fill-mode: both;
    `;

export const slideInStyle = css<SlideInProps>`
  ${slideInStylesFactory()}
`;

export const slideInDelayedStyle = css`
  ${slideInStylesFactory({ delay: ANIMATION_SPEED })}
`;

export const slideInDownStyle = css`
  transform-origin: top;
  animation: ${fadeInKeyframes} ${ANIMATION_SPEED}s ease, ${moveInTopKeyframes} ${ANIMATION_SPEED}s ease, ${scaleInYKeyframes} 0.1s ease;
`;

export const SlideIn = styled.div`
  ${slideInStyle}
`;

export const SlideInDelayed = styled.div`
  ${slideInDelayedStyle}
`;
