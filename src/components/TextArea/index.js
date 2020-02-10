import AutosizeTextArea from 'react-textarea-autosize';

import { inputStyle } from '@/components/Input/styles';
import { styled } from '@/hocs';

const TextArea = styled(AutosizeTextArea)`
  ${inputStyle}

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

export default TextArea;
