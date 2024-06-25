import { Input } from '@voiceflow/ui';
import React from 'react';

import HideableInput from '@/components/HideableInput';
import * as Settings from '@/components/Settings';

import type { SecretField } from '../types';

export interface SecretsConfigItemProps extends SecretField {
  value: unknown;
  className?: string;
  onChangeValue?: (newSecretValue: unknown) => void | Promise<void>;
}

const SecretsConfigItem: React.FC<SecretsConfigItemProps> = ({
  name,
  value,
  uiConfig: { description, isConfidential, placeholder },
  onChangeValue,
}) => (
  <Settings.SubSection header={name} splitView>
    {isConfidential ? (
      <HideableInput value={String(value)} placeholder={placeholder} onChangeText={onChangeValue} />
    ) : (
      <Input value={String(value)} placeholder={placeholder} onChangeText={onChangeValue} />
    )}

    <Settings.SubSection.Description>{description}</Settings.SubSection.Description>
  </Settings.SubSection>
);

export default SecretsConfigItem;
