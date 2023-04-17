import { css, keyframes, styled } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';

const SlideKeyframes = keyframes`
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
`;

export interface SlideProps {
  delay?: number;
  origin?: string;
  duration?: number;
}

const getAnimationStyles =
  ({ delay: defaultDelay = 0, origin: defaultOrigin = 'top', duration: defaultDuration = ANIMATION_SPEED }: SlideProps = {}) =>
  ({ delay = defaultDelay, origin = defaultOrigin, duration = defaultDuration }: SlideProps) =>
    css`
      transform-origin: ${origin};
      animation: ${SlideKeyframes} ${duration}s ease-in-out;
      animation-delay: ${delay}s;
      animation-fill-mode: both;
      /* stylelint-disable-next-line */
    `;

export const Slide = css<SlideProps>`
  ${getAnimationStyles()}
`;

export const SlideDelayed = css`
  ${getAnimationStyles({ delay: ANIMATION_SPEED })}
`;

export const SlideContainer = styled.div`
  ${Slide}
`;

export const SlideDelayedContainer = styled.div`
  ${SlideDelayed}
`;

export const SlideDown = css`
  transform-origin: top;
  animation: fadein ${ANIMATION_SPEED}s ease, movein ${ANIMATION_SPEED}s ease, scaleY 0.1s ease;
`;
