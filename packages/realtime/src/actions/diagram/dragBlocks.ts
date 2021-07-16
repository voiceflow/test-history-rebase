import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { NoopDiagramActionControl } from './utils';

class DragBlocksControl extends NoopDiagramActionControl<ActionCreatorPayload<typeof Realtime.diagram.dragBlocks>> {
  actionCreator = Realtime.diagram.dragBlocks;
}

export default DragBlocksControl;
