import type { Event } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'event';

export interface EventState extends Normalized<Event> {}
