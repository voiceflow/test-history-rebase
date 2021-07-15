import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

import { resendDiagramChannel } from '../../utils';

const addBlocks: Plugin = (server) =>
  server.action(Realtime.diagram.addBlocks, {
    access: (ctx, action) => server.diagramAuthorizer(server, Number(ctx.userId), action.payload.diagramID),
    resend: resendDiagramChannel,
    process: (_ctx, _action, _meta) => {
      // persist to database
    },
  });

export default addBlocks;
