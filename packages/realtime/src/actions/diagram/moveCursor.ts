import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopDiagramActionControl } from './utils';

class MoveCursorControl extends AbstractNoopDiagramActionControl<Realtime.diagram.AwarenessMoveCursor> {
  actionCreator = Realtime.diagram.awarenessMoveCursor;
}

export default MoveCursorControl;
