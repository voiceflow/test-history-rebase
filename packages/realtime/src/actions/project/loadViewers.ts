import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopProjectActionControl } from './utils';

class LoadProjectViewers extends AbstractNoopProjectActionControl<Realtime.project.AwarenessLoadViewersPayload> {
  actionCreator = Realtime.project.awarenessLoadViewers;
}

export default LoadProjectViewers;
