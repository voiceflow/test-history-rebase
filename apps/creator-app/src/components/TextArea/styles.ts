import { fontResetStyle, inputStyle } from '@voiceflow/ui';
import AutosizeTextArea from 'react-textarea-autosize';

import { css, styled } from '@/hocs/styled';

const textAreaStyle = css`
  box-sizing: border-box;
  min-height: ${({ theme }) => theme.components.input.height}px;
  width: 100%;
  resize: none;

  &:focus {
    outline: 0;
  }
`;

export const TextArea = styled(AutosizeTextArea)`
  ${inputStyle}
  ${textAreaStyle}
  ${fontResetStyle}
`;

export const StaticTextArea = styled.textarea`
  ${inputStyle}
  ${textAreaStyle}
  ${fontResetStyle}
`;
