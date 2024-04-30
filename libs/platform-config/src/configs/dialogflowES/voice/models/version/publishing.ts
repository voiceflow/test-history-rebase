import type { DFESConstants, DFESVersion } from '@voiceflow/google-dfes-types';

import type * as Common from '@/configs/common';

export interface Model extends Common.Voice.Models.Version.Publishing.Extends<DFESVersion.VoicePublishing> {
  locales: DFESConstants.Locale[];
}
