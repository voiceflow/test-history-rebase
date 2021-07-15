import { Channels } from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const diagramChannel: Plugin = (server) =>
  server.channel<Parameters<typeof Channels.diagram>[0]>(Channels.diagram({ diagramID: ':diagramID' }), {
    access: (ctx) => server.diagramAuthorizer(server, Number(ctx.userId), ctx.params.diagramID),
  });

export default diagramChannel;
