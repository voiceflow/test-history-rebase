import { Box, Button, SectionV2 } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as Settings from '@/components/Settings';

import { SecretsConfig, SecretsConfigProps } from './components';

export type { InputField, SecretField } from './types';

export interface SecretsConfigSectionProps extends SecretsConfigProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  submitSecrets: () => void;
  onSuccess?: VoidFunction;
  onError?: VoidFunction;
}

const SecretsConfigSection: React.FC<SecretsConfigSectionProps> = ({
  title,
  secrets,
  description,
  secretsStore,
  updateSecret,
  submitSecrets,
  onError = () => toast.error('Failed to save secrets'),
  onSuccess = () => toast.success('Saved'),
}) => {
  const [loading, setLoading] = React.useState(false);

  const onSave = async () => {
    try {
      setLoading(true);

      await submitSecrets();
      await onSuccess();
    } catch {
      await onError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Settings.Section title={title} description={description}>
      <Settings.Card>
        <SecretsConfig secretsStore={secretsStore} secrets={secrets} updateSecret={updateSecret} />

        <SectionV2.Divider />

        <Settings.SubSection contentProps={{ topOffset: 3 }}>
          <Box.FlexEnd>
            <Button isLoading={loading} disabled={loading} onClick={onSave} width={75}>
              Save
            </Button>
          </Box.FlexEnd>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default SecretsConfigSection;
