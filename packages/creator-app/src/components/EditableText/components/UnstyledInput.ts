import AutosizeInput from 'react-input-autosize';

import { styled } from '@/hocs';

import { defaultTextStyles } from '../styles';

const UnstyledInput = styled(AutosizeInput)`
  input {
    ${defaultTextStyles}
  }
`;

export default UnstyledInput;
