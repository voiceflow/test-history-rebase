import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { getDBNodes } from '@/actions/creator/importSnapshot';
import { AbstractVersionResourceControl } from '@/actions/version/utils';

class ImportSnapshot extends AbstractVersionResourceControl<Realtime.canvasTemplate.ImportSnapshotPayload> {
  protected actionCreator = Realtime.canvasTemplate.importSnapshot;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.canvasTemplate.ImportSnapshotPayload>) => {
    const dbNodes = getDBNodes(payload);

    await this.services.diagram.addManyNodes(payload.diagramID, Object.values(dbNodes));
  };
}

export default ImportSnapshot;
