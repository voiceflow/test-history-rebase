import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const removePort: Plugin = (server) =>
  server.type(Realtime.node.removePort.type, {
    access: (_ctx, _action, _meta) => {
      // implement access logic
      return true;
    },
    process: (_ctx, _action, _meta) => {
      // persist to database
    },
  });

export default removePort;
