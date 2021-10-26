import * as Realtime from '@voiceflow/realtime-sdk';

import { createRPC } from '@/ducks/utils';

import { activateVersionV2 } from './sideEffects';

export const activateVersionRPC = createRPC(Realtime.version.activateVersion, activateVersionV2);

export const rpcs = [activateVersionRPC];
