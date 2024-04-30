import type { DFESConstants, DFESVersion } from '@voiceflow/google-dfes-types';

import type * as Common from '@/configs/common';

export interface Model extends Common.Chat.Models.Version.Publishing.Extends<DFESVersion.ChatPublishing> {
  locales: DFESConstants.Locale[];
}
