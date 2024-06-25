import type { ProjectSecretTag } from '@voiceflow/schema-types';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import type { SecretsStore } from '../../../hooks';
import type { SecretField } from '../types';
import SecretsConfigItem from './SecretsConfigItem';

export interface SecretsConfigProps {
  secrets: SecretField[];
  updateSecret: (key: ProjectSecretTag, value: any) => void;
  secretsStore: SecretsStore;
}

const SecretsConfig: React.FC<SecretsConfigProps> = ({ secrets, secretsStore, updateSecret }) => (
  <>
    {secrets.map((secret, index) => (
      <React.Fragment key={secret.name}>
        <SecretsConfigItem
          {...secret}
          value={secretsStore[secret.secretTag]}
          onChangeValue={(newValue) => updateSecret(secret.secretTag, newValue)}
        />

        {index !== secrets.length - 1 && <SectionV2.Divider />}
      </React.Fragment>
    ))}
  </>
);

export default SecretsConfig;
