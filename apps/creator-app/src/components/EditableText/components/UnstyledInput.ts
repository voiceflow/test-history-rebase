import AutosizeInput from 'react-input-autosize';

import { styled } from '@/hocs/styled';

import { defaultTextStyles } from '../styles';

const UnstyledInput = styled(AutosizeInput)`
  text-overflow: none;

  input {
    ${defaultTextStyles}
  }
`;

export default UnstyledInput;
