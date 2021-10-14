import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractProjectChannelControl } from '../utils';

class UpdateProjectViewers extends AbstractProjectChannelControl<Realtime.project.awareness.UpdateViewersPayload> {
  protected actionCreator = Realtime.project.awareness.updateViewers;

  protected process = Realtime.Utils.functional.noop;
}

export default UpdateProjectViewers;
