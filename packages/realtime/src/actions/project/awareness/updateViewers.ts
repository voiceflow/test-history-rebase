import * as Realtime from '@voiceflow/realtime-sdk';

import { resendProjectChannel } from '@/actions/project/utils';
import { AbstractNoopActionControl } from '@/actions/utils';

class UpdateProjectViewers extends AbstractNoopActionControl<Realtime.project.awareness.UpdateViewersPayload> {
  protected actionCreator = Realtime.project.awareness.updateViewers;

  protected resend = resendProjectChannel;
}

export default UpdateProjectViewers;
