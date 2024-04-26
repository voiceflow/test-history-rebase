import type * as Common from '@platform-config/configs/common';
import type { DFESVersion } from '@voiceflow/google-dfes-types';

export interface Model extends Common.Chat.Models.Version.Settings.Extends<DFESVersion.ChatSettings> {}
