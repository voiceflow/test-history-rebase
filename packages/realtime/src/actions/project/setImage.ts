import * as Realtime from '@voiceflow/realtime-sdk';

import { Plugin } from '@/types';

import { resendProjectChannel } from '../../utils';

const setImage: Plugin = (server) =>
  server.action(Realtime.project.setImage, {
    access: (_ctx, _action, _meta) => {
      // implement access logic
      return true;
    },
    resend: resendProjectChannel,
    process: (_ctx, _action, _meta) => {
      // persist to database
    },
  });

export default setImage;
