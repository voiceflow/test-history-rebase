import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractNoopDiagramActionControl } from '../utils';

class UnlockEntitiesControl extends AbstractNoopDiagramActionControl<Realtime.diagram.awareness.LockUnlockEntityPayload> {
  actionCreator = Realtime.diagram.awareness.unlockEntities;
}

export default UnlockEntitiesControl;
