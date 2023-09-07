import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopDiagramActionControl } from '@/actions/diagram/utils';

class InitializeControl extends AbstractNoopDiagramActionControl<Realtime.creator.SnapshotPayload> {
  protected actionCreator = Realtime.creator.initialize;
}

export default InitializeControl;
