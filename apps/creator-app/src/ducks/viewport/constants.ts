import type * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import type { ViewportState } from './types';

export const STATE_KEY = 'viewport';

export const INITIAL_STATE: ViewportState = Normal.createEmpty<Realtime.ViewportModel>();
