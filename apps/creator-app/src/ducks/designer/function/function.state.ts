import type { Function } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'function';

export interface FunctionState extends Normalized<Function> {}
