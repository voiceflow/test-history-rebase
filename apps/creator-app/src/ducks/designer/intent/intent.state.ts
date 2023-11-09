import type { Intent } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'intent';

export interface IntentState extends Normalized<Intent> {}
