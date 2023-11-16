import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

interface ContextData extends BaseContextData {
  topicIDs: string[];
  subtopicIDs: string[];
}

class DeleteDomainWithNewVersion extends AbstractDomainResourceControl<Realtime.domain.DeleteWithNewVersionPayload, ContextData> {
  protected actionCreator = Realtime.domain.deleteWithNewVersion;

  protected process = async (ctx: Context<ContextData>, { payload }: Action<Realtime.domain.DeleteWithNewVersionPayload>) => {
    const { creatorID, clientID } = ctx.data;
    const { domainID, versionID, projectID, workspaceID } = payload;

    const dbDomain = await this.services.domain.get(payload.versionID, payload.domainID);

    await this.services.version.snapshot(creatorID, versionID, { name: `delete domain [${dbDomain.name}] backup`, manualSave: true });

    const subtopicIDs = await this.services.diagram.getFlatSubtopicIDsByTopicIDs(versionID, dbDomain.topicIDs);

    await Promise.all([
      this.services.diagram.deleteMany(versionID, [...dbDomain.topicIDs, ...subtopicIDs]),
      this.services.domain.delete(payload.versionID, domainID),
    ]);

    ctx.data.topicIDs = dbDomain.topicIDs;
    ctx.data.subtopicIDs = subtopicIDs;

    await Promise.all([
      this.server.processAs(creatorID, clientID, Realtime.domain.crud.remove({ versionID, projectID, workspaceID, key: domainID })),
      this.server.processAs(
        creatorID,
        clientID,
        Realtime.diagram.crud.removeMany({ versionID, projectID, workspaceID, keys: [...dbDomain.topicIDs, ...subtopicIDs] })
      ),
    ]);
  };

  protected finally = async (ctx: Context<ContextData>, { payload }: Action<Realtime.domain.DeleteWithNewVersionPayload>) => {
    const { creatorID, clientID, topicIDs, subtopicIDs } = ctx.data;
    const { projectID, workspaceID, versionID } = payload;

    await Promise.all([
      this.unlockAllTopics(versionID, [...topicIDs, ...subtopicIDs]),
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      ...(this.services.feature.isEnabled(Realtime.FeatureFlag.THREAD_COMMENTS, { userID: creatorID, workspaceID })
        ? [
            this.services.requestContext.createAsync(() =>
              this.services.thread.deleteManyByDiagramsAndBroadcast({ userID: creatorID, clientID }, payload, topicIDs)
            ),
          ]
        : [this.server.processAs(creatorID, clientID, Realtime.thread.removeManyByDiagramIDs({ projectID, diagramIDs: topicIDs, workspaceID }))]),
    ]);
  };

  private async unlockAllTopics(versionID: string, topicIDs: string[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const topicID of topicIDs) {
      // eslint-disable-next-line no-await-in-loop
      await this.services.lock.unlockAllEntities(versionID, topicID);
    }
  }
}

export default DeleteDomainWithNewVersion;
