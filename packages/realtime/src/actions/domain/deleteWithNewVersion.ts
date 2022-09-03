import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

interface ContextData extends BaseContextData {
  topicIDs: string[];
}

class DeleteDomainWithNewVersion extends AbstractDomainResourceControl<Realtime.domain.DeleteWithNewVersionPayload, ContextData> {
  protected actionCreator = Realtime.domain.deleteWithNewVersion;

  protected process = async (ctx: Context<ContextData>, { payload }: Action<Realtime.domain.DeleteWithNewVersionPayload>) => {
    const { creatorID } = ctx.data;
    const { domainID, versionID, projectID, versionName, workspaceID } = payload;

    const dbDomain = await this.services.domain.get(creatorID, payload.versionID, payload.domainID);

    await this.services.version.saveSnapshot(creatorID, versionID, versionName || '', { manualSave: !!versionName });

    await Promise.all([this.services.diagram.deleteMany(dbDomain.topicIDs), this.services.domain.delete(creatorID, payload.versionID, domainID)]);

    ctx.data.topicIDs = dbDomain.topicIDs;

    await Promise.all([
      this.server.processAs(creatorID, Realtime.domain.crud.remove({ versionID, projectID, workspaceID, key: domainID })),
      this.server.processAs(creatorID, Realtime.diagram.crud.removeMany({ versionID, projectID, workspaceID, keys: dbDomain.topicIDs })),
    ]);
  };

  protected finally = async (ctx: Context<ContextData>) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const topicID of ctx.data.topicIDs) {
      // eslint-disable-next-line no-await-in-loop
      await this.services.lock.unlockAllEntities(topicID);
    }
  };
}

export default DeleteDomainWithNewVersion;
