import { Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { Identifier } from '@/styles/constants';

import SectionDescription from './SectionDescription';
import SectionErrorMessage from './SectionErrorMessage';

interface InvocationNameSectionProps {
  value: string;
  error: string;
  onChange: (value: string) => void;
  description?: React.ReactNode;
}

const InvocationNameSection: React.FC<InvocationNameSectionProps> = ({ value, error, onChange, description }) => (
  <Section
    header="Invocation Name"
    variant={SectionVariant.FORM}
    dividers={false}
    customHeaderStyling={{ paddingTop: '24px' }}
    customContentStyling={{ paddingBottom: '0px' }}
  >
    <Input
      id={Identifier.INVOCATION_NAME_INPUT}
      error={!!error}
      value={value}
      autoFocus
      placeholder="Enter invocation name"
      onChangeText={onChange}
    />

    {error ? <SectionErrorMessage>{error}</SectionErrorMessage> : <SectionDescription>{description}</SectionDescription>}
  </Section>
);

export default InvocationNameSection;
