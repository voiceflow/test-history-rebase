import * as Common from '@platform-config/configs/common';
import { DFESVersion } from '@voiceflow/google-dfes-types';

export interface Model extends Common.Chat.Models.Version.Settings.Extends<DFESVersion.ChatSettings> {}
