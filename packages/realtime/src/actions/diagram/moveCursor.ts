import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { NoopDiagramActionControl } from './utils';

class MoveCursorControl extends NoopDiagramActionControl<ActionCreatorPayload<typeof Realtime.diagram.moveCursor>> {
  actionCreator = Realtime.diagram.moveCursor;
}

export default MoveCursorControl;
