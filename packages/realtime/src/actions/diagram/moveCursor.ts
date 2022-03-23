import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopDiagramActionControl } from './utils';

class MoveCursorControl extends AbstractNoopDiagramActionControl<Realtime.diagram.awareness.MoveCursorPayload> {
  actionCreator = Realtime.diagram.awareness.moveCursor;
}

export default MoveCursorControl;
