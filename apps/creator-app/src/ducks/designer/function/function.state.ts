import type { Function } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'function';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface FunctionState extends Normalized<Function> {}
