import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

import { resendProjectChannel } from '../../utils';

const identifyViewer: Plugin = (server) =>
  server.noop(Realtime.project.identifyViewer, {
    access: (ctx, action) => server.projectAuthorizer(server, Number(ctx.userId), action.payload.projectID),
    resend: resendProjectChannel,
  });

export default identifyViewer;
