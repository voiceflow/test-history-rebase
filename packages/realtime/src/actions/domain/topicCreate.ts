import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDomainResourceControl } from './utils';

class TopicCreate extends AbstractDomainResourceControl<Realtime.domain.TopicCreatePayload> {
  protected actionCreator = Realtime.domain.topicCreate.started;

  protected process = this.reply(Realtime.domain.topicCreate, async (ctx, { payload }) =>
    this.createTopic(ctx, payload, payload.domainID, payload.topic)
  );
}

export default TopicCreate;
