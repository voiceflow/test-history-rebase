import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const add: Plugin = (server) =>
  server.action(Realtime.link.add, {
    access: (_ctx, _action, _meta) => {
      // implement access logic
      return true;
    },
    process: (_ctx, _action, _meta) => {
      // persist to database
    },
  });

export default add;
