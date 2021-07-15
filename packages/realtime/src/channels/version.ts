import { Channels } from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

const versionChannel: Plugin = (server) =>
  server.channel<Parameters<typeof Channels.version>[0]>(Channels.version({ versionID: ':versionID' }), {
    access: (ctx) => server.versionAuthorizer(server, Number(ctx.userId), ctx.params.versionID),
  });

export default versionChannel;
