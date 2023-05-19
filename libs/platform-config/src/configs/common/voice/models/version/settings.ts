import * as Base from '@platform-config/configs/base';
import { Nullable } from '@voiceflow/common';
import { VoiceVersion } from '@voiceflow/voice-types';

import * as Prompt from '../prompt';

export interface StaticGlobalNoMatch<Voice extends string = string> extends Base.Models.Version.Settings.StaticGlobalNoMatch {
  prompt?: Nullable<Prompt.Model<Voice>>;
}

export interface GlobalNoReply<Voice extends string = string> extends Base.Models.Version.Settings.GlobalNoReply {
  prompt?: Nullable<Prompt.Model<Voice>>;
}

export interface Model<Voice extends string = string> extends Base.Models.Version.Settings.Extends<VoiceVersion.Settings<Voice>> {
  error: Nullable<Prompt.Model<Voice>>;
  globalNoMatch?: StaticGlobalNoMatch<Voice> | Base.Models.Version.Settings.GenerativeGlobalNoMatch;
  globalNoReply?: GlobalNoReply<Voice>;
}

export type Extends<T, Voice extends string = string> = Model<Voice> & Omit<T, keyof Model | 'session'>;
