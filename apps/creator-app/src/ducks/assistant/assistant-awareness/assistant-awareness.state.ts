import type * as Realtime from '@voiceflow/realtime-sdk';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'awareness';

export interface AssistantAwarenessState {
  viewers: Record<string, Normalized<Realtime.Viewer>>;
}

export const INITIAL_STATE: AssistantAwarenessState = {
  viewers: {},
};
