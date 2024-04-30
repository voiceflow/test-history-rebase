import type { DFESVersion } from '@voiceflow/google-dfes-types';

import type * as Common from '@/configs/common';

export interface Model extends Common.Chat.Models.Version.Settings.Extends<DFESVersion.ChatSettings> {}
