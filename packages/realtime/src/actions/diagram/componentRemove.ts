import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from './utils';

class ComponentRemove extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload> {
  protected actionCreator = Realtime.diagram.componentRemove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.BaseDiagramPayload>) => {
    const { creatorID } = ctx.data;
    const { diagramID, versionID, projectID, workspaceID } = payload;

    await Promise.all([this.services.version.removeComponent(versionID, diagramID), this.services.diagram.delete(diagramID)]);

    await this.server.processAs(creatorID, Realtime.diagram.crud.remove({ versionID, projectID, workspaceID, key: diagramID }));
  };

  protected finally = async (_ctx: Context, { payload }: Action<Realtime.BaseDiagramPayload>) => {
    await this.services.lock.unlockAllEntities(payload.diagramID);
  };
}

export default ComponentRemove;
