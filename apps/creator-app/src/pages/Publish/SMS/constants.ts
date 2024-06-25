import { ProjectSecretTag } from '@voiceflow/schema-types';

import type { SecretField } from '@/pages/Publish/components';

export const SECRETS_CONFIG: SecretField[] = [
  {
    name: 'Account SID',
    secretTag: ProjectSecretTag.TWILIO_ACCOUNT_SID,
    uiConfig: {
      placeholder: 'Enter account SID',
      isConfidential: false,
      description: 'The SID associated with your Twilio account.',
    },
  },
  {
    name: 'API Key',
    secretTag: ProjectSecretTag.TWILIO_API_KEY,
    uiConfig: {
      placeholder: 'Enter API key',
      isConfidential: false,
      description: 'The API Key used by the Voiceflow runtime to authenticate with Twilio.',
    },
  },
  {
    name: 'API Secret',
    secretTag: ProjectSecretTag.TWILIO_API_SECRET,
    uiConfig: {
      placeholder: 'Enter API secret',
      isConfidential: true,
      description: 'The API Secret used by the Voiceflow runtime to authenticate with Twilio.',
    },
  },
];
