import type { EventMapping } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'mapping';

export interface EventMappingState extends Normalized<EventMapping> {}
