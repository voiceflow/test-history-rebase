import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractNoopDiagramActionControl } from '@/legacy/actions/diagram/utils';

class InitializeControl extends AbstractNoopDiagramActionControl<Realtime.creator.SnapshotPayload> {
  protected actionCreator = Realtime.creator.initialize;
}

export default InitializeControl;
