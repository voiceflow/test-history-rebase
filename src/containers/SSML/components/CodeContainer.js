import Textarea from 'react-textarea-autosize';

import { styled } from '@/hocs';

const CodeContainer = styled(Textarea)`
  width: 100%;
  margin: 40px 0 20px 0;
  padding: 20px;
  font-family: monospace;
  white-space: pre-wrap;
  border: 1px solid #d4d9e6;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(17, 49, 96, 0.06);
  resize: none;
`;

export default CodeContainer;
