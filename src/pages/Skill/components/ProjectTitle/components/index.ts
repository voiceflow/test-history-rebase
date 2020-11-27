import AutosizeInput from 'react-input-autosize';

import { styled } from '@/hocs';

export { default as ExportIcon } from './ExportIcon';

export const TitleInput = styled(AutosizeInput)`
  position: relative;
  top: 2px;
  input {
    outline: none;
    border: none;
  }
  margin-right: 10px;
`;
