import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDomainResourceControl } from './utils';

class TopicDuplicate extends AbstractDomainResourceControl<Realtime.domain.TopicDuplicatePayload> {
  protected actionCreator = Realtime.domain.topicDuplicate.started;

  protected process = this.reply(Realtime.domain.topicDuplicate, async (ctx, { payload }) => {
    const { domainID, topicID, versionID } = payload;

    const [dbDiagram, diagramNames] = await Promise.all([this.services.diagram.get(topicID), this.services.diagram.getAllNames(versionID)]);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(dbDiagram.name, diagramNames);

    return this.createTopic(ctx, payload, domainID, { ...Utils.object.omit(dbDiagram, ['_id', 'creatorID', 'versionID']), name: uniqueName });
  });
}

export default TopicDuplicate;
