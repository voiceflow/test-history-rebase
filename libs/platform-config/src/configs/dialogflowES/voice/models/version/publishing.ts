import type * as Common from '@platform-config/configs/common';
import type { DFESConstants, DFESVersion } from '@voiceflow/google-dfes-types';

export interface Model extends Common.Voice.Models.Version.Publishing.Extends<DFESVersion.VoicePublishing> {
  locales: DFESConstants.Locale[];
}
