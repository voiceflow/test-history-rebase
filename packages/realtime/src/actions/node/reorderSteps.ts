import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class ReorderSteps extends AbstractDiagramActionControl<Realtime.node.ReorderStepsPayload> {
  actionCreator = Realtime.node.reorderSteps;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default ReorderSteps;
