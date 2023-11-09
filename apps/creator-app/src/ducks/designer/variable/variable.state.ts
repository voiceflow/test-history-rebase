import type { Variable } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'variable';

export interface VariableState extends Normalized<Variable> {}
