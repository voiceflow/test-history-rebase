import type { FunctionPath } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'function_path';

export interface FunctionPathState extends Normalized<FunctionPath> {}
