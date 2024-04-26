import type * as Common from '@platform-config/configs/common';
import type { GoogleConstants, GoogleVersion } from '@voiceflow/google-types';

export interface Model extends Common.Voice.Models.Version.Publishing.Extends<GoogleVersion.VoicePublishing> {
  locales: GoogleConstants.Locale[];
}
