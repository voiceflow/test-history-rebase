import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractNoopDiagramActionControl } from '../utils';

class LockEntitiesControl extends AbstractNoopDiagramActionControl<Realtime.diagram.awareness.LockUnlockEntityPayload> {
  actionCreator = Realtime.diagram.awareness.lockEntities;
}

export default LockEntitiesControl;
