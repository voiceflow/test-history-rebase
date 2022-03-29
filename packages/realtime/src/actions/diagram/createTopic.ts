import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl, NewDiagramContextData } from './utils';

class CreateTopic extends AbstractDiagramResourceControl<Realtime.diagram.CreateDiagramPayload, NewDiagramContextData> {
  protected actionCreator = Realtime.diagram.createTopic.started;

  protected process = this.reply(Realtime.diagram.createTopic, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const topicFactory = Realtime.Utils.diagram.topicDiagramFactory(payload.diagram.name);

    const [diagram, version] = await Promise.all([
      this.createDiagram(ctx, payload, {
        ...topicFactory,
        ...payload.diagram,
      }),
      this.services.version.get(creatorID, payload.versionID),
    ]);

    await this.services.version.patch(creatorID, payload.versionID, {
      topics: [...(version.topics ?? []), { sourceID: diagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }],
    });

    ctx.data.newDiagram = { ...diagram, ...topicFactory };

    return diagram;
  });

  protected finally = async (ctx: Context<NewDiagramContextData>, { payload }: Action<Realtime.diagram.CreateDiagramPayload>) => {
    const { newDiagram } = ctx.data;
    this.reloadStartingBlocksFromNewDiagram(ctx, payload, { id: newDiagram.id, nodes: newDiagram.nodes });
  };
}

export default CreateTopic;
