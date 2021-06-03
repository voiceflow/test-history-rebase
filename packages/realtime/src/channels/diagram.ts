import { DIAGRAM_KEY, PROJECT_KEY, VERSION_KEY } from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const diagramChannel: Plugin = (server) =>
  server.channel<{ projectID: string; versionID: string; diagramID: string }>(
    `${PROJECT_KEY}/:projectID/${VERSION_KEY}/:versionID/${DIAGRAM_KEY}/:diagramID`,
    {
      access: (_ctx, _action, _meta) => {
        // implement access logic
        return true;
      },
      filter: (_ctx, _action, _meta) => {
        // persist to database
      },
    }
  );

export default diagramChannel;
