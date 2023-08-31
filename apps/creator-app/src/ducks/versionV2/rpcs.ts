import * as Realtime from '@voiceflow/realtime-sdk';

import { createRPC } from '@/ducks/utils';

import { initializeVersion } from './sideEffects';

export const activateVersionRPC = createRPC(Realtime.version.activateVersion, initializeVersion);

export const rpcs = [activateVersionRPC];
