import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractProjectResourceControl } from './utils';

class SendFreestyleDisclaimerEmail extends AbstractProjectResourceControl<Realtime.BaseProjectPayload> {
  protected actionCreator = Realtime.project.sendFreestyleDisclaimerEmail.started;

  protected resend = terminateResend;

  process = this.reply(Realtime.project.sendFreestyleDisclaimerEmail, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    await this.services.project.sendFreestyleDisclaimerEmail(creatorID, payload.projectID);
  });
}

export default SendFreestyleDisclaimerEmail;
