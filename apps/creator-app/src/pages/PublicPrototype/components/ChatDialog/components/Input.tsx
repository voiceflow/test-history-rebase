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
  hideInput?: boolean;
  buttonsOnly: boolean;
}

const UserInput: React.FC<UserInputProps> = ({
  value,
  onEnterPress,
  onChange,
  isIdle,
  testEnded,
  isMobile,
  onStart,
  hideInput = false,
  buttonsOnly,
}) => {
  const preventIOSBodyScrolling = React.useCallback((event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const placeholder = testEnded ? 'This conversation has ended' : !hideInput && 'Type a message...';

  const inputRef = React.useRef<HTMLInputElement>(null);

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

  React.useEffect(
    () => () => document.querySelector('#root')!.removeEventListener('touchmove', preventIOSBodyScrolling),
    []
  );

  React.useEffect(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, [testEnded]);

  React.useEffect(() => {
    if (buttonsOnly) {
      inputRef?.current?.focus?.();
    }
  }, [hideInput]);

  return (
    <InputContent isMobile={isMobile} onClick={() => isIdle && !hideInput && onStart()}>
      <Input
        id="vf-prototype-user-input"
        key={String(!isIdle)}
        ref={inputRef}
        value={value}
        fullWidth
        variant={InputVariant.INLINE}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={isIdle || testEnded || hideInput}
        autoFocus={!isIdle || testEnded}
        noOverflow
        placeholder={placeholder || ''}
        onEnterPress={swallowEvent(onEnterPress)}
        onChangeText={onChange}
      />
    </InputContent>
  );
};

export default UserInput;
