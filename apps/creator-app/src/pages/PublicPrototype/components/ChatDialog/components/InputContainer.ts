import { css, styled } from '@/hocs/styled';
import SpeechBarContainer from '@/pages/Prototype/components/PrototypeSpeechBar/components/Container';

import InputContent from './InputContent';

export const DESKTOP_INPUT_CONTAINER_HEIGHT = 80;
export const MOBILE_INPUT_CONTAINER_HEIGHT = 60;

const InputContainer = styled.div<{ isMobile?: boolean }>`
  height: ${DESKTOP_INPUT_CONTAINER_HEIGHT}px;
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

  ${InputContent} {
    max-width: calc(100% + 32px);
    height: calc(100% + 32px);
    margin: -16px 0px -16px -32px;

    input {
      padding-left: 32px;
    }
  }

  ${({ isMobile }) =>
    isMobile &&
    css`
      padding: 16px 16px 16px 24px;
      height: ${MOBILE_INPUT_CONTAINER_HEIGHT}px;

      ${InputContent} {
        max-width: calc(100% + 24px);
        margin: -16px 0px -16px -24px;

        input {
          padding-left: 24px;
        }
      }
    `}
`;

export default InputContainer;
