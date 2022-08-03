import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramResourceControl, NewDiagramContextData } from './utils';

class DuplicateDiagram extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload, NewDiagramContextData> {
  protected actionCreator = Realtime.diagram.duplicate.started;

  protected process = this.reply(Realtime.diagram.duplicate, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const [{ _id, type = BaseModels.Diagram.DiagramType.COMPONENT, intentStepIDs = [], ...diagram }, diagramNames] = await Promise.all([
      this.services.diagram.get(payload.diagramID),
      this.services.diagram.getAll(payload.versionID, ['name']).then((diagrams) => diagrams.map(({ name }) => name)),
    ]);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(diagram.name, diagramNames);

    const [newDiagram, version] = await Promise.all([
      this.createDiagram(ctx, payload, { ...diagram, type, intentStepIDs, name: uniqueName }),
      this.services.version.get(creatorID, payload.versionID),
    ] as const);

    await this.services.version.patch(
      creatorID,
      payload.versionID,
      type === BaseModels.Diagram.DiagramType.TOPIC
        ? { topics: [...(version.topics ?? []), { sourceID: newDiagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }] }
        : { components: [...(version.components ?? []), { sourceID: newDiagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }] }
    );

    ctx.data.newDiagram = { ...newDiagram, ...diagram };

    return newDiagram;
  });

  protected finally = async (ctx: Context<NewDiagramContextData>, { payload }: Action<Realtime.BaseDiagramPayload>) => {
    const { newDiagram } = ctx.data;
    this.reloadStartingBlocksFromNewDiagram(ctx, payload, { id: newDiagram.id, nodes: newDiagram.nodes });
  };
}

export default DuplicateDiagram;
