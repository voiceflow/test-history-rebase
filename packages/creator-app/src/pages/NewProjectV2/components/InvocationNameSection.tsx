import { Nullable } from '@voiceflow/common';
import { Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { Identifier } from '@/styles/constants';

import SectionDescription from './SectionDescription';
import SectionErrorMessage from './SectionErrorMessage';

interface InvocationNameSectionProps {
  value: string;
  error: boolean;
  onChange: (value: string) => void;
  description?: string;
  errorMessage?: Nullable<string>;
}

const InvocationNameSection: React.FC<InvocationNameSectionProps> = ({ value, error, onChange, description, errorMessage }) => (
  <Section
    header="Invocation Name"
    variant={SectionVariant.FORM}
    dividers={false}
    customHeaderStyling={{ paddingTop: '24px' }}
    customContentStyling={{ paddingBottom: '0px' }}
  >
    <Input id={Identifier.INVOCATION_NAME_INPUT} error={error} value={value} autoFocus placeholder="Enter invocation name" onChangeText={onChange} />

    {error ? (
      <SectionErrorMessage>{errorMessage || 'Invocation name is required'}</SectionErrorMessage>
    ) : (
      <SectionDescription>{description}</SectionDescription>
    )}
  </Section>
);

export default InvocationNameSection;
