import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

class TopicMoveDomain extends AbstractDomainResourceControl<Realtime.domain.TopicMoveDomainPayload> {
  protected actionCreator = Realtime.domain.topicMoveDomain;

  protected process = async (ctx: Context, { payload }: Action<Realtime.domain.TopicMoveDomainPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const { domainID, versionID, topicDiagramID, newDomainID, rootTopicID } = payload;

    await Promise.all([
      this.services.domain.topicRemove(versionID, domainID, topicDiagramID),
      this.services.domain.topicAdd(versionID, newDomainID, topicDiagramID),
    ]);

    if (rootTopicID) {
      await this.server.processAs(
        creatorID,
        Realtime.diagram.removeMenuItem({
          ...payload,
          sourceID: topicDiagramID,
          diagramID: rootTopicID,
        })
      );
    }
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.domain.TopicMoveDomainPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.newDomainID, ctx.data.creatorID),
    ]);
  };
}

export default TopicMoveDomain;
