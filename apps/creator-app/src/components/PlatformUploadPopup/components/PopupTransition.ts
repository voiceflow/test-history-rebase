import { keyframes, styled } from '@/hocs/styled';
import { ANIMATION_SPEED } from '@/styles/theme';

const slideIn = keyframes`
  from {
    transform: translate3d(0, 10px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;
const PopupTransition = styled.div`
  transform: translate3d(0, 0, 0);
  animation: ${slideIn} ${ANIMATION_SPEED}s ease-in-out ${ANIMATION_SPEED}s;
  animation-fill-mode: both;
  width: 100%;
  height: 100%;
`;

export default PopupTransition;
