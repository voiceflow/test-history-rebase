import type { Function } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'function';

export interface FunctionState extends Normalized<Function> {}
