import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { resendProjectChannel } from '@/legacy/actions/project/utils';
import { AbstractNoopActionControl } from '@/legacy/actions/utils';

class UpdateProjectViewers extends AbstractNoopActionControl<Realtime.project.awareness.UpdateDiagramViewersPayload> {
  protected actionCreator = Realtime.project.awareness.updateDiagramViewers;

  protected resend = resendProjectChannel;
}

export default UpdateProjectViewers;
