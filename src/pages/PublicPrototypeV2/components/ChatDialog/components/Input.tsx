import React from 'react';

import { Flex } from '@/components/Box';
import Input, { InputVariant } from '@/components/Input';
import { withEnterPress } from '@/utils/dom';

export type UserInputProps = {
  value: string;
  isIdle?: boolean;
  onChange: (value: string) => void;
  testEnded?: boolean;
  onEnterPress: () => void;
};

const UserInput: React.FC<UserInputProps> = ({ value, onEnterPress, onChange, isIdle, testEnded }) => (
  <Flex flex={1} fontSize={15}>
    <Input
      key={String(!isIdle)}
      value={value}
      variant={InputVariant.INLINE}
      onChange={({ currentTarget }) => onChange(currentTarget.value)}
      disabled={isIdle || testEnded}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={!isIdle || testEnded}
      fullWidth
      noOverflow
      onKeyPress={withEnterPress(onEnterPress)}
      placeholder={testEnded ? 'This conversation has ended' : 'Type a message...'}
    />
  </Flex>
);

export default UserInput;
