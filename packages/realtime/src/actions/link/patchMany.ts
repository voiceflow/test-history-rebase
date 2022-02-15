import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class PatchManyLinks extends AbstractDiagramActionControl<Realtime.link.PatchManyPayload> {
  actionCreator = Realtime.link.patchMany;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default PatchManyLinks;
