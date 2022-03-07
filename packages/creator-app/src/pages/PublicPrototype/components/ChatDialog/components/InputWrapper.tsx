import { styled } from '@/hocs';

import { DESKTOP_INPUT_CONTAINER_HEIGHT, MOBILE_INPUT_CONTAINER_HEIGHT } from './InputContainer';

const InputWrapper = styled.div<{ isMobile?: boolean }>`
  height: ${({ isMobile }) => (isMobile ? MOBILE_INPUT_CONTAINER_HEIGHT : DESKTOP_INPUT_CONTAINER_HEIGHT)}px;
  overflow: hidden;
`;

export default InputWrapper;
