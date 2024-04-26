import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

class TopicReorder extends AbstractVersionResourceControl<Realtime.domain.TopicReorderPayload> {
  protected actionCreator = Realtime.domain.topicReorder;

  protected process = async (
    _ctx: Context,
    { payload, meta }: Action<Realtime.domain.TopicReorderPayload>
  ): Promise<void> => {
    if (meta?.skipPersist) return;

    if (!payload.domainID) {
      throw new Error('domainID is required');
    }

    await this.services.domain.topicReorder(payload.versionID, payload.domainID, payload.topicID, payload.toIndex);
  };

  protected finally = async (
    ctx: Context,
    { payload, meta }: Action<Realtime.domain.TopicReorderPayload>
  ): Promise<void> => {
    if (meta?.skipPersist) return;

    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default TopicReorder;
