import type { FunctionVariable } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'function_variable';

export interface FunctionVariableState extends Normalized<FunctionVariable> {}
