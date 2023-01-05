import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractNoopDiagramActionControl } from '../utils';

class UpdateLockedEntitiesControl extends AbstractNoopDiagramActionControl<Realtime.diagram.awareness.UpdateLocksPayload> {
  actionCreator = Realtime.diagram.awareness.updateLockedEntities;
}

export default UpdateLockedEntitiesControl;
