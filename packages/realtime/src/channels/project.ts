import { Channels } from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const projectChannel: Plugin = (server) =>
  server.channel<Parameters<typeof Channels.project>[0]>(Channels.project({ projectID: ':projectID' }), {
    access: (ctx) => server.projectAuthorizer(server, Number(ctx.userId), ctx.params.projectID),
  });

export default projectChannel;
