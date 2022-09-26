import { css, keyframes, styled } from '@/hocs/styled';
import { ANIMATION_SPEED } from '@/styles/theme';

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
      animation-fill-mode: both;
      animation-delay: ${delay}s;
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
  animation: fadein ${ANIMATION_SPEED}s ease, movein ${ANIMATION_SPEED}s ease, scaleY 0.1s ease;
  transform-origin: top;
`;
