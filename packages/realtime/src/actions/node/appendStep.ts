import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AppendStep extends AbstractDiagramActionControl<Realtime.node.AppendStepPayload> {
  actionCreator = Realtime.node.appendStep;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AppendStep;
