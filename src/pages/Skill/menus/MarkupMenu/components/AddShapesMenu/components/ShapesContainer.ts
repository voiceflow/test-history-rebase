import Flex from '@/components/Flex';
import { keyframes, styled } from '@/hocs';
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

const ShapesContainer = styled(Flex as any)`
  border-radius: 5px;
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
  padding: 5px;
  background-color: #f9f9f9;

  animation: ${fadeInKeyframes} ${({ length = ANIMATION_SPEED }) => length}s ease-in-out;
  animation-fill-mode: both;
  animation-delay: ${({ delay = ANIMATION_SPEED }) => delay}s;
`;

export default ShapesContainer;
