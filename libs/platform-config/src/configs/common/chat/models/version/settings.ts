import * as Base from '@platform-config/configs/base';
import { BaseVersion } from '@voiceflow/base-types';
import { ChatVersion } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';

import * as Prompt from '../prompt';

export interface GlobalNoMatch extends Base.Models.Version.Settings.GlobalNoMatch {
  type: BaseVersion.GlobalNoMatchType;
  prompt?: Nullable<Prompt.Model>;
}

export interface GlobalNoReply extends Base.Models.Version.Settings.GlobalNoReply {
  prompt?: Nullable<Prompt.Model>;
}

export interface Model extends Base.Models.Version.Settings.Extends<ChatVersion.Settings> {
  error: Nullable<Prompt.Model>;
  globalNoMatch?: GlobalNoMatch;
  globalNoReply?: GlobalNoReply;
}

export type Extends<T> = Model & Omit<T, keyof Model | 'session'>;
