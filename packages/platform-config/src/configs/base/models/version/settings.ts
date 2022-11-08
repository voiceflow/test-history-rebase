import { BaseVersion } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';

export interface GlobalNoMatch {
  prompt?: Nullable<unknown>;
}

export interface GlobalNoReply {
  prompt?: Nullable<unknown>;
  delay?: number | undefined;
}

export interface Model extends Omit<BaseVersion.Settings, 'session' | 'error' | 'globalNoReply' | 'globalNoMatch'> {
  error: Nullable<unknown>;
  globalNoMatch?: GlobalNoMatch;
  globalNoReply?: GlobalNoReply;
}

export type Extends<T> = Model & Omit<T, keyof Model | 'session'>;
