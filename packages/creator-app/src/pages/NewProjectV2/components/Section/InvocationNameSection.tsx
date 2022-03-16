import { Nullable } from '@voiceflow/common';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import InvocationName from '../InvocationName';

interface InvocationNameSectionProps {
  invocationName: string;
  onInvocationNameChange: (value: string) => void;
  invocationDescription?: string;
  invocationError: boolean;
  invocationErrorMessage?: Nullable<string>;
}

const InvocationNameSection: React.FC<InvocationNameSectionProps> = ({
  invocationName,
  onInvocationNameChange,
  invocationDescription,
  invocationError,
  invocationErrorMessage,
}) => {
  return (
    <Section header="Invocation Name" variant={SectionVariant.TERTIARY}>
      <InvocationName
        invocationName={invocationName}
        onInvocationNameChange={onInvocationNameChange}
        description={invocationDescription}
        error={invocationError}
        errorMessage={invocationErrorMessage}
      />
    </Section>
  );
};

export default InvocationNameSection;
