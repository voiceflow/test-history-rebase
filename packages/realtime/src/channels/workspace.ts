import { Channels } from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const workspaceChannel: Plugin = (server) =>
  server.channel<Parameters<typeof Channels.workspace>[0]>(Channels.workspace({ workspaceID: ':workspaceID' }), {
    access: (ctx) => server.workspaceAuthorizer(server, Number(ctx.userId), ctx.params.workspaceID),
  });

export default workspaceChannel;
