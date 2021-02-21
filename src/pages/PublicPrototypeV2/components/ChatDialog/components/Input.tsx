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
  isMobile?: boolean;
};

const UserInput: React.FC<UserInputProps> = ({ value, onEnterPress, onChange, isIdle, testEnded, isMobile }) => (
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
      {...(isMobile && {
        onBlur: ({ target }) => {
          target.focus();
        },
      })}
    />
  </Flex>
);

export default UserInput;
