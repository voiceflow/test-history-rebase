import { css, keyframes, styled } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

const fadeDownKeyframes = keyframes`
  from {
    transform: translate3d(0, 8px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

export const fadeDownStyles = css`
  animation: ${fadeDownKeyframes} ${({ length = ANIMATION_SPEED }) => length}s ease-in-out;
  animation-fill-mode: both;
`;

export const fadeDownDelayStyles = css`
  ${fadeDownStyles}
   animation-delay: ${({ delay = ANIMATION_SPEED }) => delay}s;
`;

export const FadeDownContainer = styled.div`
  ${fadeDownDelayStyles}
`;
