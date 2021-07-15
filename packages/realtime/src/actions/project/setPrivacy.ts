import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

import { resendProjectChannel } from '../../utils';

const setPrivacy: Plugin = (server) =>
  server.action(Realtime.project.setPrivacy, {
    access: (_ctx, _action, _meta) => {
      // implement access logic
      return true;
    },
    resend: resendProjectChannel,
    process: (_ctx, _action, _meta) => {
      // persist to database
    },
  });

export default setPrivacy;
