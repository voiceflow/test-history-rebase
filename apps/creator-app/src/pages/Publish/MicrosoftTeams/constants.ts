import { ProjectSecretTag } from '@voiceflow/schema-types';

import type { SecretField } from '../components';

export const secretsConfig: SecretField[] = [
  {
    name: 'Bot ID',
    secretTag: ProjectSecretTag.MICROSOFT_TEAMS_APP_ID,
    uiConfig: {
      placeholder: 'Enter bot ID',
      isConfidential: false,
      description: 'The GUID which uniquely identifies the bot that powers your Teams application.',
    },
  },
  {
    name: 'Client Secret',
    secretTag: ProjectSecretTag.MICROSOFT_TEAMS_APP_PASSWORD,
    uiConfig: {
      placeholder: 'Enter client secret',
      isConfidential: true,
      description: "The bot's password used by the Voiceflow runtime to authenticate with Microsoft APIs.",
    },
  },
];
