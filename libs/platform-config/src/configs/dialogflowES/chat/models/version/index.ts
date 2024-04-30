import type { Nullable } from '@voiceflow/common';
import type { DFESVersion } from '@voiceflow/google-dfes-types';

import type * as Common from '@/configs/common';

import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface Session extends Common.Chat.Models.Version.Session {}

export interface Model extends Common.Chat.Models.Version.Model {
  status: Nullable<DFESVersion.ChatPlatformData['status']>;
  settings: Settings.Model;
  publishing: Publishing.Model;
}
