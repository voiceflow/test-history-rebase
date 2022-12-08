import { ProjectSecretTag } from '@voiceflow/schema-types';
import React from 'react';

import { SecretsStore } from '../../../hooks';
import { SecretField } from '../types';
import { SecretsConfigItem } from './SecretsConfigItem';

export interface SecretsConfigProps {
  secrets: SecretField[];
  secretsStore: SecretsStore;
  updateSecret: (key: ProjectSecretTag, value: any) => void;
}

export const SecretsConfig: React.FC<SecretsConfigProps> = ({ secrets, secretsStore, updateSecret }) => {
  return (
    <form>
      {secrets.map((secret) => (
        <SecretsConfigItem
          {...secret}
          key={secret.name}
          value={secretsStore[secret.secretTag]}
          onChangeValue={(newValue: any) => updateSecret(secret.secretTag, newValue)}
        />
      ))}
    </form>
  );
};
