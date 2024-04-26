import type * as Base from '@platform-config/configs/base';
import type { ChatVersion } from '@voiceflow/chat-types';
import type { Nullable } from '@voiceflow/common';

import type * as Prompt from '../prompt';

export interface StaticGlobalNoMatch extends Base.Models.Version.Settings.StaticGlobalNoMatch {
  prompt?: Nullable<Prompt.Model>;
}

export interface GlobalNoReply extends Base.Models.Version.Settings.GlobalNoReply {
  prompt?: Nullable<Prompt.Model>;
}

export interface Model extends Base.Models.Version.Settings.Extends<ChatVersion.Settings> {
  error: Nullable<Prompt.Model>;
  globalNoMatch?: StaticGlobalNoMatch | Base.Models.Version.Settings.GenerativeGlobalNoMatch;
  globalNoReply?: GlobalNoReply;
}

export type Extends<T> = Model & Omit<T, keyof Model | 'session'>;
