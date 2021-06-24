import { inputStyle } from '@voiceflow/ui';
import Textarea from 'react-textarea-autosize';

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
