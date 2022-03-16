import { Nullable } from '@voiceflow/common';
import { Input } from '@voiceflow/ui';
import React from 'react';

import { Identifier } from '@/styles/constants';

import { SectionDescription, SectionErrorMessage } from '../Section/components';

interface InvocationNameProps {
  invocationName: string;
  onInvocationNameChange: (value: string) => void;
  error: boolean;
  errorMessage?: Nullable<string>;
  description?: string;
}

const InvocationName: React.FC<InvocationNameProps> = ({ invocationName, onInvocationNameChange, error, errorMessage, description }) => {
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

      {error && invocationName ? <SectionErrorMessage>{errorMessage}</SectionErrorMessage> : <SectionDescription>{description}</SectionDescription>}
    </>
  );
};

export default InvocationName;
