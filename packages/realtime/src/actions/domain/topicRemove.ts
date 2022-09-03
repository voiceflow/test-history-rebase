import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

class TopicRemove extends AbstractDomainResourceControl<Realtime.domain.TopicRemovePayload> {
  protected actionCreator = Realtime.domain.topicRemove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.domain.TopicRemovePayload>) => {
    const { creatorID } = ctx.data;
    const { topicID, domainID, versionID, projectID, workspaceID } = payload;

    await Promise.all([this.services.diagram.delete(topicID), this.services.domain.topicRemove(creatorID, versionID, domainID, topicID)]);

    await this.server.processAs(creatorID, Realtime.diagram.crud.remove({ versionID, projectID, workspaceID, key: topicID }));
  };

  protected finally = async (_ctx: Context, { payload }: Action<Realtime.domain.TopicRemovePayload>) => {
    await this.services.lock.unlockAllEntities(payload.topicID);
  };
}

export default TopicRemove;
