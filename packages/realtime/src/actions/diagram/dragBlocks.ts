import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopDiagramActionControl } from './utils';

class DragBlocksControl extends AbstractNoopDiagramActionControl<Realtime.diagram.DragMoveBlocksPayload> {
  actionCreator = Realtime.diagram.dragBlocks;
}

export default DragBlocksControl;
