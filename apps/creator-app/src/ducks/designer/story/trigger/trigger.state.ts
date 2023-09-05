import type { AnyTrigger } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'trigger';

export interface TriggerState extends Normalized<AnyTrigger> {}
