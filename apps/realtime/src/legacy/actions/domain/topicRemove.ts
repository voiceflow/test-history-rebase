import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

interface ContextData extends BaseContextData {
  subtopicIDs: string[];
}

class TopicRemove extends AbstractDomainResourceControl<Realtime.domain.TopicRemovePayload, ContextData> {
  protected actionCreator = Realtime.domain.topicRemove;

  protected process = async (ctx: Context<ContextData>, { payload }: Action<Realtime.domain.TopicRemovePayload>) => {
    const { creatorID, clientID } = ctx.data;
    const { topicID, domainID, versionID, projectID, workspaceID } = payload;

    const subtopicIDs = await this.services.diagram.getFlatSubtopicIDsByTopicIDs(versionID, [topicID]);

    ctx.data.subtopicIDs = subtopicIDs;

    await Promise.all([
      this.services.diagram.deleteMany(versionID, [topicID, ...subtopicIDs]),
      this.services.domain.topicRemove(versionID, domainID, topicID),
    ]);

    await this.server.processAs(
      creatorID,
      clientID,
      Realtime.diagram.crud.removeMany({ versionID, projectID, workspaceID, keys: [topicID, ...subtopicIDs] })
    );
  };

  protected finally = async (ctx: Context<ContextData>, { payload }: Action<Realtime.domain.TopicRemovePayload>) => {
    const { creatorID, clientID } = ctx.data;
    const { versionID, topicID, projectID, workspaceID } = payload;

    const removedDiagramIDs = [topicID, ...ctx.data.subtopicIDs];

    await Promise.all([
      this.unlockAllTopics(versionID, [topicID, ...ctx.data.subtopicIDs]),
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      ...(this.services.feature.isEnabled(Realtime.FeatureFlag.THREAD_COMMENTS, { userID: creatorID, workspaceID })
        ? [
            this.services.requestContext.createAsync(() =>
              this.services.thread.deleteManyByDiagramsAndBroadcast({ userID: creatorID, clientID }, payload, removedDiagramIDs)
            ),
          ]
        : [
            this.server.processAs(
              creatorID,
              clientID,
              Realtime.thread.removeManyByDiagramIDs({ projectID, diagramIDs: removedDiagramIDs, workspaceID })
            ),
          ]),
    ]);
  };

  private async unlockAllTopics(versionID: string, topicIDs: string[]) {
    for (const topicID of topicIDs) {
      // eslint-disable-next-line no-await-in-loop
      await this.services.lock.unlockAllEntities(versionID, topicID);
    }
  }
}

export default TopicRemove;
