import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl } from '../utils';

class SubtopicRemove extends AbstractDiagramResourceControl<Realtime.diagram.SubtopicRemovePayload> {
  protected actionCreator = Realtime.diagram.subtopicRemove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.diagram.SubtopicRemovePayload>) => {
    const { creatorID } = ctx.data;
    const { domainID, subtopicID, versionID, projectID, workspaceID, rootTopicID } = payload;

    await Promise.all([this.services.diagram.delete(subtopicID), this.services.diagram.removeMenuItem(rootTopicID, subtopicID)]);

    await Promise.all([
      this.server.processAs(creatorID, Realtime.diagram.crud.remove({ versionID, projectID, workspaceID, key: subtopicID })),
      this.server.processAs(
        creatorID,
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
    const { creatorID } = ctx.data;
    const { domainID, subtopicID, projectID, versionID, workspaceID } = action.payload;

    await Promise.all([
      this.services.project.setUpdatedBy(projectID, creatorID),
      this.services.domain.setUpdatedBy(versionID, domainID, creatorID),
      this.services.lock.unlockAllEntities(subtopicID),
      this.server.processAs(creatorID, Realtime.thread.removeManyByDiagramIDs({ projectID, diagramIDs: [subtopicID], workspaceID })),
    ]);
  };
}

export default SubtopicRemove;
