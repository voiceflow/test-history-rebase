import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '../utils';

class ComponentRemove extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload> {
  protected actionCreator = Realtime.diagram.componentRemove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.BaseDiagramPayload>) => {
    const { creatorID, clientID } = ctx.data;
    const { diagramID, versionID, projectID, workspaceID } = payload;

    await Promise.all([this.services.diagram.delete(versionID, diagramID), this.services.version.removeComponent(versionID, diagramID)]);

    await this.server.processAs(creatorID, clientID, Realtime.diagram.crud.remove({ versionID, projectID, workspaceID, key: diagramID }));
  };

  protected finally = async (ctx: Context, action: Action<Realtime.BaseDiagramPayload>) => {
    const { creatorID, clientID } = ctx.data;
    const { versionID, diagramID, projectID } = action.payload;

    await Promise.all([
      this.services.project.setUpdatedBy(projectID, creatorID),
      this.services.lock.unlockAllEntities(versionID, diagramID),
      this.services.requestContext.createAsync(() =>
        this.services.thread.deleteManyByDiagramsAndBroadcast({ userID: creatorID, clientID }, action.payload, [diagramID])
      ),
    ]);
  };
}

export default ComponentRemove;
