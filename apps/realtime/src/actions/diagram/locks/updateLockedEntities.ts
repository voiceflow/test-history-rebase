import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopDiagramActionControl } from '../utils';

class UpdateLockedEntitiesControl extends AbstractNoopDiagramActionControl<Realtime.diagram.awareness.UpdateLocksPayload> {
  actionCreator = Realtime.diagram.awareness.updateLockedEntities;
}

export default UpdateLockedEntitiesControl;
