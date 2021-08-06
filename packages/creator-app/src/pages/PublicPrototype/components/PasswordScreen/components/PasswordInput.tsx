import { Input, KeyName } from '@voiceflow/ui';
import React from 'react';

import Container from './Container';
import Description from './Description';
import Title from './Title';
import ViewPrototypeButton from './ViewPrototypeButton';

export interface PasswordInputProps {
  checkLogin: (password: string) => void;
  colorScheme?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ checkLogin, colorScheme }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = React.useCallback(() => {
    const userInput = inputRef.current?.value ?? '';
    checkLogin(userInput);
  }, [checkLogin, inputRef]);

  const onKeyPress = React.useCallback(
    (event) => {
      if (event.key === KeyName.ENTER) onSubmit();
    },
    [onSubmit]
  );

  return (
    <>
      <Title mb={16}>This link is password protected</Title>
      <Description>Enter the password below to view the prototype.</Description>
      <Container>
        <Input ref={inputRef} type="password" className="prototype-password-input" placeholder="Enter password" onKeyDown={onKeyPress} />
      </Container>
      <ViewPrototypeButton color={colorScheme} onClick={onSubmit}>
        View Prototype
      </ViewPrototypeButton>
    </>
  );
};

export default PasswordInput;
