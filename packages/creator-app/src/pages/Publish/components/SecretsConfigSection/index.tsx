import { Box, Button, toast } from '@voiceflow/ui';
import React from 'react';

import Section from '../Section';
import { SecretsConfig, SecretsConfigProps } from './components';

export type { InputField, SecretField } from './types';

export interface SecretsConfigSectionProps extends SecretsConfigProps {
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  submitSecrets: () => any | Promise<any>;
}

const SecretsConfigSection: React.FC<SecretsConfigSectionProps> = ({ secrets, title, subtitle, secretsStore, updateSecret, submitSecrets }) => {
  const [loading, setLoading] = React.useState(false);

  const onSave = async () => {
    try {
      setLoading(true);
      await submitSecrets();
      toast.success('Saved');
    } catch {
      toast.error('Failed to save secrets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section title={title} subtitle={subtitle} card={false}>
      <Section.Card p={0}>
        <SecretsConfig secretsStore={secretsStore} secrets={secrets} updateSecret={updateSecret} />
        <Box.FlexEnd py={24} px={32}>
          <Button isLoading={loading} disabled={loading} onClick={onSave}>
            Save
          </Button>
        </Box.FlexEnd>
      </Section.Card>
    </Section>
  );
};

export default SecretsConfigSection;
