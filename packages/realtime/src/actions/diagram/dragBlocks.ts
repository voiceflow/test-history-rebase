import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

import { resendDiagramChannel } from '../../utils';

const dragBlocks: Plugin = (server) =>
  server.noop(Realtime.diagram.dragBlocks, {
    access: (ctx, action) => server.diagramAuthorizer(server, Number(ctx.userId), action.payload.diagramID),
    resend: resendDiagramChannel,
  });

export default dragBlocks;
