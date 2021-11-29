import * as Realtime from '@voiceflow/realtime-sdk';

import { createRPC } from '@/ducks/utils';

export const reloadSessionRPC = createRPC(Realtime.protocol.reloadSession, () => async () => window.location.reload());

export const rpcs = [reloadSessionRPC];
