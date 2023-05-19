import { BaseUtils, BaseVersion } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';

import * as Prompt from '../prompt';

export interface StaticGlobalNoMatch {
  type?: BaseVersion.GlobalNoMatchType.STATIC;
  prompt?: Nullable<Prompt.Model>;
}

export interface GenerativeGlobalNoMatch {
  type: BaseVersion.GlobalNoMatchType.GENERATIVE;
  prompt: BaseUtils.ai.AIModelParams;
}

export interface GlobalNoReply {
  prompt?: Nullable<Prompt.Model>;
  delay?: number | undefined;
}

export interface Model extends Omit<BaseVersion.Settings<Prompt.Model>, 'session' | 'error' | 'globalNoReply' | 'globalNoMatch'> {
  error: Nullable<Prompt.Model>;
  locales?: string[];
  globalNoMatch?: StaticGlobalNoMatch | GenerativeGlobalNoMatch;
  globalNoReply?: GlobalNoReply;
}

export type Extends<T> = Model & Omit<T, keyof Model | 'session'>;
