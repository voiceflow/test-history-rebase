import { css, keyframes, styled } from '@/hocs';
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

export const Slide = css`
  animation: ${SlideKeyframes} ${({ length = ANIMATION_SPEED }) => length}s ease-in-out;
  animation-fill-mode: both;
`;

export const SlideDelay = css`
  ${Slide}
   animation-delay: ${({ delay = ANIMATION_SPEED }) => delay}s;
`;

export const SlideContainer = styled.div`
  transform-origin: ${({ origin = 'top' }) => origin};
  ${SlideDelay}
`;
