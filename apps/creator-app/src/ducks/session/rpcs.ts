import * as Realtime from '@voiceflow/realtime-sdk';

import { createRPC } from '@/ducks/utils';
import logger from '@/utils/logger';

export const reloadSessionRPC = createRPC(Realtime.protocol.reloadSession, () => async () => {
  logger.warn('[reload] reloadSessionRPC');
  window.location.reload();
});

export const rpcs = [reloadSessionRPC];
