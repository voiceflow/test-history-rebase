import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class CreateComponent extends AbstractDiagramResourceControl<Realtime.diagram.CreateDiagramPayload> {
  protected actionCreator = Realtime.diagram.createComponent.started;

  protected process = this.reply(Realtime.diagram.createComponent, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const [diagram, version] = await Promise.all([
      this.createDiagram(ctx, payload, {
        ...Realtime.Utils.diagram.componentDiagramFactory(
          payload.diagram.name,
          payload.diagram.offsetX && payload.diagram.offsetY ? [payload.diagram.offsetX, payload.diagram.offsetY] : undefined
        ),
        ...payload.diagram,
      }),
      this.services.version.get(creatorID, payload.versionID),
    ]);

    await this.services.version.patch(creatorID, payload.versionID, {
      components: [...(version.components ?? []), { sourceID: diagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }],
    });

    return diagram;
  });
}

export default CreateComponent;
