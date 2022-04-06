import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopDiagramActionControl } from './utils';

class MoveLinkControl extends AbstractNoopDiagramActionControl<Realtime.diagram.awareness.MoveLinkPayload> {
  actionCreator = Realtime.diagram.awareness.moveLink;
}

export default MoveLinkControl;
