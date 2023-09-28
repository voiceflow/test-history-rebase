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
    const { domainID, versionID, projectID, versionName, workspaceID } = payload;

    const dbDomain = await this.services.domain.get(payload.versionID, payload.domainID);

    await this.services.version.snapshot(creatorID, versionID, { manualSave: !!versionName, name: versionName });

    const subtopicIDs = await this.services.diagram.getFlatSubtopicIDsByTopicIDs(dbDomain.topicIDs);

    await Promise.all([
      this.services.diagram.deleteMany([...dbDomain.topicIDs, ...subtopicIDs]),
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
    const { projectID, workspaceID } = payload;

    await Promise.all([
      this.unlockAllTopics([...topicIDs, ...subtopicIDs]),
      this.server.processAs(creatorID, clientID, Realtime.thread.removeManyByDiagramIDs({ projectID, diagramIDs: topicIDs, workspaceID })),
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
    ]);
  };

  private async unlockAllTopics(topicIDs: string[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const topicID of topicIDs) {
      // eslint-disable-next-line no-await-in-loop
      await this.services.lock.unlockAllEntities(topicID);
    }
  }
}

export default DeleteDomainWithNewVersion;
