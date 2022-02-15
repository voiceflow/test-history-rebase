import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class MoveManyNodes extends AbstractDiagramActionControl<Realtime.node.TranslatePayload> {
  actionCreator = Realtime.node.moveMany;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default MoveManyNodes;
