import { Input } from '@voiceflow/ui';
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
  const [value, setValue] = React.useState('');

  const onSubmit = () => checkLogin(value);

  return (
    <>
      <Title mb={16}>This link is password protected</Title>
      <Description>Enter the password below to view the prototype.</Description>

      <Container>
        <Input
          type="password"
          value={value}
          className="prototype-password-input"
          placeholder="Enter password"
          onChangeText={setValue}
          onEnterPress={onSubmit}
        />
      </Container>

      <ViewPrototypeButton color={colorScheme} onClick={onSubmit}>
        View Prototype
      </ViewPrototypeButton>
    </>
  );
};

export default PasswordInput;
