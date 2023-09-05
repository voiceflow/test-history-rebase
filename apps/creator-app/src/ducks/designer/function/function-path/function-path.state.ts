import type { FunctionPath } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'function_path';

export interface FunctionPathState extends Normalized<FunctionPath> {}
