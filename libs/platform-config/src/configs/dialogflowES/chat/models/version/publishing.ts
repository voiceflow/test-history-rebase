import type * as Common from '@platform-config/configs/common';
import type { DFESConstants, DFESVersion } from '@voiceflow/google-dfes-types';

export interface Model extends Common.Chat.Models.Version.Publishing.Extends<DFESVersion.ChatPublishing> {
  locales: DFESConstants.Locale[];
}
