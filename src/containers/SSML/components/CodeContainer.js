import Textarea from 'react-textarea-autosize';

import { inputStyle } from '@/componentsV2/Input/styles';
import { styled } from '@/hocs';

const CodeContainer = styled(Textarea)`
  ${inputStyle}
  margin: 40px 0 20px 0;
  font-family: monospace;
  white-space: pre-wrap;
  resize: none;
  outline: none;
`;

export default CodeContainer;
