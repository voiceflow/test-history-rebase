import { inputStyle } from '@voiceflow/ui';
import AutosizeTextArea from 'react-textarea-autosize';

import { css, styled } from '@/hocs';

const textAreaStyle = css`
  box-sizing: border-box;
  min-height: ${({ theme }) => theme.components.input.height}px;
  width: 100%;
  border-radius: 5px;
  font-size: 15px;
  resize: none;

  &:focus {
    outline: 0;
  }
`;

const TextArea = styled(AutosizeTextArea)`
  ${inputStyle}
  ${textAreaStyle}
`;

export const StaticTextArea = styled.textarea`
  ${inputStyle}
  ${textAreaStyle}
`;

export default TextArea;
