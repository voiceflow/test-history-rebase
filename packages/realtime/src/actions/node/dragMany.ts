import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopDiagramActionControl } from '@/actions/diagram/utils';

class DragManyNodes extends AbstractNoopDiagramActionControl<Realtime.node.TranslateNodesPayload> {
  actionCreator = Realtime.node.dragMany;
}

export default DragManyNodes;
