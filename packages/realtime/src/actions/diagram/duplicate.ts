import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class DuplicateDiagram extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload> {
  protected actionCreator = Realtime.diagram.duplicate.started;

  protected process = this.reply(Realtime.diagram.duplicate, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const [{ _id, type = Models.DiagramType.COMPONENT, intentStepIDs = [], ...diagram }, diagramNames] = await Promise.all([
      this.services.diagram.get(creatorID, payload.diagramID),
      this.services.diagram.getAll(creatorID, payload.versionID).then((diagrams) => diagrams.map(({ name }) => name)),
    ]);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(diagram.name, diagramNames);

    return this.createDiagram(ctx, payload, { ...diagram, type, intentStepIDs, name: uniqueName });
  });
}

export default DuplicateDiagram;
