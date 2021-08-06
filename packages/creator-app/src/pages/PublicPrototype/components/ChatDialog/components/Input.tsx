import { BoxFlex, Input, InputVariant, IS_IOS, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { withEnterPress } from '@/utils/dom';

export interface UserInputProps {
  value: string;
  isIdle?: boolean;
  isMobile?: boolean;
  onStart: () => void;
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
    // mobile browsers will zoom and make css look bad if font-size is less than 16px
    <BoxFlex flex={2} fontSize={isMobile ? 16 : 15} maxWidth="100%" onClick={() => isIdle && onStart()}>
      <Input
        key={String(!isIdle)}
        value={value}
        fullWidth
        variant={InputVariant.INLINE}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={({ currentTarget }) => onChange(currentTarget.value)}
        disabled={isIdle || testEnded}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={!isIdle || testEnded}
        noOverflow
        onKeyPress={withEnterPress(swallowEvent(onEnterPress))}
        placeholder={testEnded ? 'This conversation has ended' : 'Type a message...'}
      />
    </BoxFlex>
  );
};

export default UserInput;
