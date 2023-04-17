import * as Base from '@platform-config/configs/base';
import { Nullable } from '@voiceflow/common';
import { VoiceVersion } from '@voiceflow/voice-types';

import * as Prompt from '../prompt';

export interface GlobalNoMatch<Voice extends string = string> extends Base.Models.Version.Settings.GlobalNoMatch {
  prompt?: Nullable<Prompt.Model<Voice>>;
}

export interface GlobalNoReply<Voice extends string = string> extends Base.Models.Version.Settings.GlobalNoReply {
  prompt?: Nullable<Prompt.Model<Voice>>;
}

export interface Model<Voice extends string = string> extends Base.Models.Version.Settings.Extends<VoiceVersion.Settings<Voice>> {
  error: Nullable<Prompt.Model<Voice>>;
  globalNoMatch?: GlobalNoMatch<Voice>;
  globalNoReply?: GlobalNoReply<Voice>;
}

export type Extends<T, Voice extends string = string> = Model<Voice> & Omit<T, keyof Model | 'session'>;
