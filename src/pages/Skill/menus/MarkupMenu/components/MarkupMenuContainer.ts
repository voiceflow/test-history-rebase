import Flex from '@/components/Flex';
import { css, keyframes, styled } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

const fadeInKeyframes = keyframes`
  from {
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(16px, 0, 0);
    opacity: 1;
  }
`;

const fadeOutKeyframes = keyframes`
  from {
    transform: translate3d(24px, 0, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

const MarkupMenuContainer = styled(Flex as any)<{ isOpen: boolean }>`
  position: absolute;
  z-index: 20;
  left: 0;
  top: 50px;

  animation: ${fadeOutKeyframes} ${({ length = 0.35 }) => length}s ease-in-out;
  animation-fill-mode: both;
  animation-delay: ${({ delay = 0.35 }) => delay}s;

  ${({ isOpen, length = ANIMATION_SPEED, delay = ANIMATION_SPEED }) =>
    isOpen &&
    css`
      animation: ${fadeInKeyframes} ${length}s ease-in-out;
      animation-fill-mode: both;
      animation-delay: ${delay}s;
    `}
`;

export default MarkupMenuContainer;
