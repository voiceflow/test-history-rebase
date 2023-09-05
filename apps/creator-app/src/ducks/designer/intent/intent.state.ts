import type { Intent } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'intent';

export interface IntentState extends Normalized<Intent> {}
