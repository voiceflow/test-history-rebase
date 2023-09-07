import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class TopicReorder extends AbstractVersionResourceControl<Realtime.domain.TopicReorderPayload> {
  protected actionCreator = Realtime.domain.topicReorder;

  protected process = async (_ctx: Context, { payload, meta }: Action<Realtime.domain.TopicReorderPayload>): Promise<void> => {
    if (meta?.skipPersist) return;

    await this.services.domain.topicReorder(payload.versionID, payload.domainID, payload.topicID, payload.toIndex);
  };

  protected finally = async (ctx: Context, { payload, meta }: Action<Realtime.domain.TopicReorderPayload>): Promise<void> => {
    if (meta?.skipPersist) return;

    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default TopicReorder;
