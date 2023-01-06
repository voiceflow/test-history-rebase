import { ProjectSecretTag } from '@voiceflow/schema-types';
import React from 'react';

import { SecretsStore } from '../../../hooks';
import { SecretField } from '../types';
import { SecretsConfigItem } from './SecretsConfigItem';

export interface SecretsConfigProps {
  secrets: SecretField[];
  secretsStore: SecretsStore;
  updateSecret: (key: ProjectSecretTag, value: any) => void;

  className?: string;
}

export const SecretsConfig: React.OldFC<SecretsConfigProps> = ({ secrets, secretsStore, updateSecret, className }) => {
  return (
    <form>
      {secrets.map((secret) => (
        <SecretsConfigItem
          className={className}
          {...secret}
          key={secret.name}
          value={secretsStore[secret.secretTag]}
          onChangeValue={(newValue: any) => updateSecret(secret.secretTag, newValue)}
        />
      ))}
    </form>
  );
};
