import { Input } from '@voiceflow/ui';
import React from 'react';

import { Identifier } from '@/styles/constants';

interface InvocationNameProps {
  invocationName: string;
  onInvocationNameChange: (value: string) => void;
  error: boolean;
}

const InvocationName: React.FC<InvocationNameProps> = ({ invocationName, onInvocationNameChange, error }) => {
  return (
    <>
      <Input
        id={Identifier.INVOCATION_NAME_INPUT}
        error={error}
        placeholder="Enter invocation name"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        value={invocationName}
        onChangeText={onInvocationNameChange}
      />
    </>
  );
};

export default InvocationName;
