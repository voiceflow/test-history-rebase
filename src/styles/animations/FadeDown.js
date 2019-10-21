import { css, keyframes, styled } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

const FadeDownKeyframes = keyframes`
  from {
    transform: translate3d(0, 8px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

export const FadeDown = css`
  animation: ${FadeDownKeyframes} ${({ length = ANIMATION_SPEED }) => length}s ease-in-out;
  animation-fill-mode: both;
`;

export const FadeDownDelay = css`
  ${FadeDown}
   animation-delay: ${({ delay = ANIMATION_SPEED }) => delay}s;
`;

export const FadeDownContainer = styled.div`
  ${FadeDownDelay}
`;
