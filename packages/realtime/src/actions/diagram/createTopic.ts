import { Models as BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class CreateTopic extends AbstractDiagramResourceControl<Realtime.diagram.CreateDiagramPayload> {
  protected actionCreator = Realtime.diagram.createTopic.started;

  protected process = this.reply(Realtime.diagram.createTopic, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const [diagram, version] = await Promise.all([
      this.createDiagram(ctx, payload, {
        ...Realtime.Utils.diagram.topicDiagramFactory(payload.diagram.name),
        ...payload.diagram,
      }),
      this.services.version.get(creatorID, payload.versionID),
    ]);

    await this.services.version.patch(creatorID, payload.versionID, {
      topics: [...(version.topics ?? []), { sourceID: diagram.id, type: BaseModels.VersionFolderItemType.DIAGRAM }],
    });

    return diagram;
  });
}

export default CreateTopic;
