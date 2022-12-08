import * as Platform from '@voiceflow/platform-config';
import { ProjectSecretTag } from '@voiceflow/schema-types';
import React from 'react';

import client from '@/client';
import { useAsyncEffect } from '@/hooks';

export interface SecretsManagerConfig {
  secrets: ProjectSecretTag[];
}

export type SecretsStore = Partial<Record<ProjectSecretTag, string>>;

/**
 * Manages secrets from the Project Secrets API
 */
export const useSecretsManager = (projectID: string, config: SecretsManagerConfig, platform: Platform.Constants.PlatformType) => {
  const [secretsStore, setSecretsStore] = React.useState<SecretsStore>(() => Object.fromEntries(config.secrets.map((secretTag) => [secretTag, ''])));

  const LOOKUP_KEY = `${platform}-secrets`;

  /**
   * When component is first rendered, pull all secrets required from the backend.
   */
  useAsyncEffect(async () => {
    const secretVals = await client.apiV3.projectSecret.findManyByProjectID(projectID, config.secrets);

    setSecretsStore(
      config.secrets.reduce(
        (acc, secret, index) => ({
          ...acc,
          [secret]: secretVals[index]?.secret ?? '',
        }),
        {}
      )
    );
  }, []);

  const updateSecret = React.useCallback(
    (key: ProjectSecretTag, value: unknown) => {
      setSecretsStore({
        ...secretsStore,
        [key]: value,
      });
    },
    [secretsStore]
  );

  const submitSecrets = React.useCallback(
    () =>
      client.apiV3.projectSecret.updateManySecrets(
        projectID,
        config.secrets.map((tag) => ({
          tag,
          lookup: LOOKUP_KEY,
          secret: secretsStore[tag] ?? '',
        }))
      ),
    [projectID, secretsStore]
  );

  return {
    secretsStore,
    updateSecret,
    submitSecrets,
  };
};
