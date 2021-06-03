import { PROJECT_KEY } from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const projectChannel: Plugin = (server) =>
  server.channel<{ projectID: string }>(`${PROJECT_KEY}/:projectID`, {
    access: (_ctx, _action, _meta) => {
      // implement access logic
      return true;
    },
    filter: (_ctx, _action, _meta) => {
      // persist to database
    },
  });

export default projectChannel;
