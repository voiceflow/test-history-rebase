import type { AlexaModels } from '@voiceflow/alexa-types';

export interface Account {
  token: string;
  profile: AlexaModels.AmazonProfile;
  vendors: AlexaModels.AmazonVendor[];
}
