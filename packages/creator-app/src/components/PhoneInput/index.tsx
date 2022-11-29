import { SvgIcon } from '@voiceflow/ui';
import React from 'react';
import PhoneInput from 'react-phone-number-input';

import { InputContainer } from './styled';

export type { Value as PhoneNumber } from 'react-phone-number-input';

const Input: React.FC<React.ComponentProps<typeof PhoneInput>> = ({ ...props }) => {
  return (
    <InputContainer>
      <SvgIcon icon="arrowToggle" size={8} />
      <PhoneInput {...props} />
    </InputContainer>
  );
};

export default Input;
