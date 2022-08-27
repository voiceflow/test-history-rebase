import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class CreateComponent extends AbstractDiagramResourceControl<Realtime.diagram.CreateDiagramPayload> {
  protected actionCreator = Realtime.diagram.createComponent.started;

  protected process = this.reply(Realtime.diagram.createComponent, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const [dbDiagram, version] = await Promise.all([
      this.services.diagram.create({
        ...Realtime.Utils.diagram.componentDiagramFactory(
          payload.diagram.name,
          payload.diagram.offsetX && payload.diagram.offsetY ? [payload.diagram.offsetX, payload.diagram.offsetY] : undefined
        ),
        ...payload.diagram,
        creatorID,
        versionID: payload.versionID,
      }),
      this.services.version.get(creatorID, payload.versionID),
    ]);

    const diagram = Realtime.Adapters.diagramAdapter.fromDB(dbDiagram, { rootDiagramID: version.rootDiagramID });

    await Promise.all([
      this.services.version.patch(creatorID, payload.versionID, {
        components: [...(version.components ?? []), { sourceID: diagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }],
      }),
      this.server.processAs(
        creatorID,
        Realtime.diagram.crud.add({
          key: diagram.id,
          value: diagram,
          versionID: payload.versionID,
          projectID: payload.projectID,
          workspaceID: payload.workspaceID,
        })
      ),
      this.reloadSharedNodes(ctx, payload, dbDiagram),
    ]);

    return diagram;
  });
}

export default CreateComponent;
