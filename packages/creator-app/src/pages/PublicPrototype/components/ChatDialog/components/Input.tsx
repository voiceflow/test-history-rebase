import { Input, InputVariant, IS_IOS, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import InputContent from './InputContent';

export interface UserInputProps {
  value: string;
  isIdle?: boolean;
  onStart: () => void;
  isMobile?: boolean;
  onChange: (value: string) => void;
  testEnded?: boolean;
  onEnterPress: () => void;
}

const UserInput: React.FC<UserInputProps> = ({ value, onEnterPress, onChange, isIdle, testEnded, isMobile, onStart }) => {
  const preventIOSBodyScrolling = React.useCallback((event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onFocus = React.useCallback(() => {
    if (IS_IOS) {
      document.querySelector('#root')!.removeEventListener('touchmove', preventIOSBodyScrolling);
      document.querySelector('#root')!.addEventListener('touchmove', preventIOSBodyScrolling);
    }
  }, []);

  const onBlur = React.useCallback(() => {
    if (IS_IOS) {
      document.querySelector('#root')!.removeEventListener('touchmove', preventIOSBodyScrolling);
    }
  }, [isMobile]);

  React.useEffect(() => () => document.querySelector('#root')!.removeEventListener('touchmove', preventIOSBodyScrolling), []);

  React.useEffect(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, [testEnded]);

  return (
    <InputContent isMobile={isMobile} onClick={() => isIdle && onStart()}>
      <Input
        key={String(!isIdle)}
        value={value}
        fullWidth
        variant={InputVariant.INLINE}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={isIdle || testEnded}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={!isIdle || testEnded}
        noOverflow
        placeholder={testEnded ? 'This conversation has ended' : 'Type a message...'}
        onEnterPress={swallowEvent(onEnterPress)}
        onChangeText={onChange}
      />
    </InputContent>
  );
};

export default UserInput;
