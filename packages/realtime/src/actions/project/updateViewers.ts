import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopProjectActionControl } from './utils';

class UpdateProjectViewers extends AbstractNoopProjectActionControl<Realtime.project.AwarenessUpdateViewersPayload> {
  actionCreator = Realtime.project.awarenessUpdateViewers;
}

export default UpdateProjectViewers;
