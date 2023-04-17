import * as Common from '@platform-config/configs/common';
import { AlexaConstants, AlexaVersion } from '@voiceflow/alexa-types';

export interface Model extends Common.Voice.Models.Version.Publishing.Extends<Omit<AlexaVersion.Publishing, 'locales'>> {
  locales: AlexaConstants.Locale[];
}
