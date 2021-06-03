import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const setPrivacy: Plugin = (server) =>
  server.type(Realtime.project.setPrivacy.type, {
    access: (_ctx, _action, _meta) => {
      // implement access logic
      return true;
    },
    process: (_ctx, _action, _meta) => {
      // persist to database
    },
  });

export default setPrivacy;
