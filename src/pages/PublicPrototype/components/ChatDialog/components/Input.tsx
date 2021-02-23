import React from 'react';

import { Flex } from '@/components/Box';
import Input, { InputVariant } from '@/components/Input';
import { withEnterPress } from '@/utils/dom';

export type UserInputProps = {
  value: string;
  isIdle?: boolean;
  isMobile?: boolean;
  onChange: (value: string) => void;
  testEnded?: boolean;
  onEnterPress: () => void;
};

const UserInput: React.FC<UserInputProps> = ({ value, onEnterPress, onChange, isIdle, testEnded, isMobile }) => (
  // mobile browsers will zoom and make css look bad if font-size is less than 16px
  <Flex flex={2} fontSize={isMobile ? 16 : 15} maxWidth={isMobile ? 130 : '100%'}>
    <Input
      key={String(!isIdle)}
      value={value}
      variant={InputVariant.INLINE}
      onChange={({ currentTarget }) => onChange(currentTarget.value)}
      disabled={isIdle || testEnded}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={!isIdle || testEnded}
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
