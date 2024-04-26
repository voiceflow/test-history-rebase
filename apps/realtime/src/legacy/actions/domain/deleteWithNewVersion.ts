import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { BaseContextData, Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

interface ContextData extends BaseContextData {
  topicIDs: string[];
  subtopicIDs: string[];
}

class DeleteDomainWithNewVersion extends AbstractDomainResourceControl<
  Realtime.domain.DeleteWithNewVersionPayload,
  ContextData
> {
  protected actionCreator = Realtime.domain.deleteWithNewVersion;

  protected process = async (
    ctx: Context<ContextData>,
    { payload }: Action<Realtime.domain.DeleteWithNewVersionPayload>
  ) => {
    const { creatorID, clientID } = ctx.data;
    const { domainID, versionID, projectID, workspaceID } = payload;

    if (!domainID) {
      throw new Error('domainID is required');
    }

    const dbDomain = await this.services.domain.get(versionID, domainID);

    await this.services.version.snapshot(creatorID, versionID, {
      name: `delete domain [${dbDomain.name}] backup`,
      manualSave: true,
    });

    const subtopicIDs = await this.services.diagram.getFlatSubtopicIDsByTopicIDs(versionID, dbDomain.topicIDs);

    await Promise.all([
      this.services.diagram.deleteMany(versionID, [...dbDomain.topicIDs, ...subtopicIDs]),
      this.services.domain.delete(versionID, domainID),
    ]);

    ctx.data.topicIDs = dbDomain.topicIDs;
    ctx.data.subtopicIDs = subtopicIDs;

    await Promise.all([
      this.server.processAs(
        creatorID,
        clientID,
        Realtime.domain.crud.remove({ versionID, projectID, workspaceID, key: domainID })
      ),
      this.server.processAs(
        creatorID,
        clientID,
        Realtime.diagram.crud.removeMany({
          versionID,
          projectID,
          workspaceID,
          keys: [...dbDomain.topicIDs, ...subtopicIDs],
        })
      ),
    ]);
  };

  protected finally = async (
    ctx: Context<ContextData>,
    { payload }: Action<Realtime.domain.DeleteWithNewVersionPayload>
  ) => {
    const { creatorID, clientID, topicIDs, subtopicIDs } = ctx.data;
    const { versionID } = payload;

    await Promise.all([
      this.unlockAllTopics(versionID, [...topicIDs, ...subtopicIDs]),
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.requestContext.createAsync(() =>
        this.services.thread.deleteManyByDiagramsAndBroadcast(topicIDs, {
          auth: { userID: creatorID, clientID },
          context: payload,
        })
      ),
    ]);
  };

  private async unlockAllTopics(versionID: string, topicIDs: string[]) {
    for (const topicID of topicIDs) {
      // eslint-disable-next-line no-await-in-loop
      await this.services.lock.unlockAllEntities(versionID, topicID);
    }
  }
}

export default DeleteDomainWithNewVersion;
