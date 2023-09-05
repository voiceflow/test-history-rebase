import type { Variable } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'variable';

export interface VariableState extends Normalized<Variable> {}
