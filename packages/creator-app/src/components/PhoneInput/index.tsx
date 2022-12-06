import { SvgIcon } from '@voiceflow/ui';
import React from 'react';
import PhoneInput from 'react-phone-number-input';

import { InputContainer } from './styled';

export type { Value as PhoneNumber } from 'react-phone-number-input';
export { formatPhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';

const Input: React.FC<React.ComponentProps<typeof PhoneInput> & { error?: boolean }> = ({ error, ...props }) => {
  return (
    <InputContainer error={error}>
      <SvgIcon icon="arrowRightTopics" size={8} rotation={90} color="#6E849AD9" />
      <PhoneInput {...props} />
    </InputContainer>
  );
};

export default Input;
