import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class TransplantSteps extends AbstractDiagramActionControl<Realtime.node.TransplantStepsPayload> {
  actionCreator = Realtime.node.transplantSteps;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default TransplantSteps;
