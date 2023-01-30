import { Input } from '@voiceflow/ui';

import { keyframes, styled } from '@/hocs/styled';
import { ANIMATION_SPEED } from '@/styles/theme';

const widthAnimation = keyframes`
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
`;

export const InputContainer = styled.div`
  animation: ${widthAnimation} ${ANIMATION_SPEED}s ease;
  transform-origin: right;
`;

export const StyledInput = styled(Input)`
  border: none;
  box-shadow: none;
  padding: 10px 16px 10px 0;

  &:active,
  &:focus,
  &:focus-within {
    border: none;
    box-shadow: none;
  }
`;
