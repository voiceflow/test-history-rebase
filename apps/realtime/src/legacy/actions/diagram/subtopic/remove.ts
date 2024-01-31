import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '../utils';

class SubtopicRemove extends AbstractDiagramResourceControl<Realtime.diagram.SubtopicRemovePayload> {
  protected actionCreator = Realtime.diagram.subtopicRemove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.diagram.SubtopicRemovePayload>) => {
    const { creatorID, clientID } = ctx.data;
    const { domainID, subtopicID, versionID, projectID, workspaceID, rootTopicID } = payload;

    await Promise.all([
      this.services.diagram.delete(versionID, subtopicID),
      this.services.diagram.removeMenuItem(versionID, rootTopicID, subtopicID),
    ]);

    await Promise.all([
      this.server.processAs(creatorID, clientID, Realtime.diagram.crud.remove({ versionID, projectID, workspaceID, key: subtopicID })),
      this.server.processAs(
        creatorID,
        clientID,
        Realtime.diagram.removeMenuItem({
          sourceID: subtopicID,
          domainID,
          versionID,
          projectID,
          diagramID: rootTopicID,
          workspaceID,
        })
      ),
    ]);
  };

  protected finally = async (ctx: Context, action: Action<Realtime.diagram.SubtopicRemovePayload>) => {
    const { creatorID, clientID } = ctx.data;
    const { domainID, subtopicID, projectID, versionID } = action.payload;

    await Promise.all([
      this.services.project.setUpdatedBy(projectID, creatorID),
      this.services.domain.setUpdatedBy(versionID, domainID, creatorID),
      this.services.lock.unlockAllEntities(versionID, subtopicID),
      this.services.requestContext.createAsync(() =>
        this.services.thread.deleteManyByDiagramsAndBroadcast({ userID: creatorID, clientID }, action.payload, [subtopicID])
      ),
    ]);
  };
}

export default SubtopicRemove;
