import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

class TopicCreate extends AbstractDomainResourceControl<Realtime.domain.TopicCreatePayload> {
  protected actionCreator = Realtime.domain.topicCreate.started;

  protected process = this.reply(Realtime.domain.topicCreate, async (ctx, { payload }) =>
    this.createTopic({
      ctx,
      payload,
      domainID: payload.domainID,
      primitiveDiagram: payload.topic,
    })
  );

  protected finally = async (ctx: Context, { payload }: Action<Realtime.domain.TopicCreatePayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default TopicCreate;
