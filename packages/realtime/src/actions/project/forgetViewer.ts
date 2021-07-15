import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

import { resendProjectChannel } from '../../utils';

const forgetViewer: Plugin = (server) =>
  server.noop(Realtime.project.forgetViewer, {
    access: (ctx, action) => server.projectAuthorizer(server, Number(ctx.userId), action.payload.projectID),
    resend: resendProjectChannel,
  });

export default forgetViewer;
