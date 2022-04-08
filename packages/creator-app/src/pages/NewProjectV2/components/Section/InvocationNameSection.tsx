import { Nullable } from '@voiceflow/common';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { InvocationSectionErrorMessage } from '../../constants';
import InvocationName from '../InvocationName';
import { SectionDescription, SectionErrorMessage } from './components';

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
    <Section
      header="Invocation Name"
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <InvocationName invocationName={invocationName} onInvocationNameChange={onInvocationNameChange} error={invocationError} />
      {invocationError ? (
        <SectionErrorMessage>{invocationErrorMessage || InvocationSectionErrorMessage}</SectionErrorMessage>
      ) : (
        <SectionDescription>{invocationDescription}</SectionDescription>
      )}
    </Section>
  );
};

export default InvocationNameSection;
