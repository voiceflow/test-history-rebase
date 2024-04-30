import type { AlexaConstants, AlexaVersion } from '@voiceflow/alexa-types';

import type * as Common from '@/configs/common';

export interface Model
  extends Common.Voice.Models.Version.Publishing.Extends<Omit<AlexaVersion.Publishing, 'locales'>> {
  locales: AlexaConstants.Locale[];
}
