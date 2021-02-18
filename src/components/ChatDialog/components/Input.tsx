import React from 'react';

import { Flex } from '@/components/Box';
import Input, { InputVariant } from '@/components/Input';

export type UserInputProps = {
  value?: string;
  onChange: () => void;
  testEnded?: boolean;
};

const UserInput: React.FC<UserInputProps> = ({ value, onChange, testEnded }) => {
  return (
    <Flex flex={1} fontSize={15}>
      <Input
        placeholder={testEnded ? 'This coversation has ended' : 'Type a message...'}
        fullWidth
        noOverflow
        variant={InputVariant.INLINE}
        value={value}
        onChange={onChange}
      />
    </Flex>
  );
};

export default UserInput;
