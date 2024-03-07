import type { AnyStoryTrigger } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'trigger';

export interface TriggerState extends Normalized<AnyStoryTrigger> {}
