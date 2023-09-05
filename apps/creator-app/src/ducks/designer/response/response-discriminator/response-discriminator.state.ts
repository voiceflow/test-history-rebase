import type { Channel, Language, ResponseDiscriminator } from '@voiceflow/sdk-logux-designer';
import { createEmpty, type Normalized } from 'normal-store';

export const STATE_KEY = 'discriminator';

export interface ResponseDiscriminatorState extends Normalized<ResponseDiscriminator> {
  idByLanguageChannelResponseID: {
    [language in Language]?: {
      [channel in Channel]?: {
        [responseID in string]?: string;
      };
    };
  };
}

export const INITIAL_STATE: ResponseDiscriminatorState = {
  ...createEmpty(),
  idByLanguageChannelResponseID: {},
};
