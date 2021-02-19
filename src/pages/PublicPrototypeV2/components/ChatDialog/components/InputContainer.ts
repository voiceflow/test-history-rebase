import { Flex } from '@/components/Box';
import { css, styled } from '@/hocs';
import SpeechBarContainer from '@/pages/Prototype/components/PrototypeSpeechBar/components/Container';

export const DESKTOP_INPUT_CONTAINER_HEIGHT = 80;
export const MOBILE_INPUT_CONTAINER_HEIGHT = 60;

const InputContainer = styled(Flex)<{ isMobile?: boolean }>`
  height: ${DESKTOP_INPUT_CONTAINER_HEIGHT}px;
  justify-content: center;
  border-top: 1px solid #dfe3ed;
  padding: 16px 24px 16px 32px;
  width: 100%;

  ${SpeechBarContainer} {
    flex: 1;
    font-size: 15px;
    width: auto;
    min-height: auto;
    margin: 0;
    padding: 0;
  }

  ${({ isMobile }) =>
    isMobile &&
    css`
      padding: 16px 16px 16px 24px;
      height: ${MOBILE_INPUT_CONTAINER_HEIGHT}px;
    `}
`;

export default InputContainer;
