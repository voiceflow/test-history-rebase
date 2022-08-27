import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class DuplicateDiagram extends AbstractDiagramResourceControl<Realtime.BaseDiagramPayload> {
  protected actionCreator = Realtime.diagram.duplicate.started;

  protected process = this.reply(Realtime.diagram.duplicate, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const [{ _id, type = BaseModels.Diagram.DiagramType.COMPONENT, menuNodeIDs = [], ...dbDiagram }, diagramNames] = await Promise.all([
      this.services.diagram.get(payload.diagramID),
      this.services.diagram.getAll(payload.versionID, ['name']).then((diagrams) => diagrams.map(({ name }) => name)),
    ]);

    const uniqueName = Realtime.Utils.diagram.getUniqueCopyName(dbDiagram.name, diagramNames);

    const [newDBDiagram, version] = await Promise.all([
      this.services.diagram.create({
        ...dbDiagram,
        type,
        name: uniqueName,
        creatorID,
        versionID: payload.versionID,
        menuNodeIDs,
      }),
      this.services.version.get(creatorID, payload.versionID),
    ] as const);

    const newDiagram = Realtime.Adapters.diagramAdapter.fromDB(newDBDiagram, { rootDiagramID: version.rootDiagramID });

    await Promise.all([
      this.services.version.patch(
        creatorID,
        payload.versionID,
        type === BaseModels.Diagram.DiagramType.TOPIC
          ? { topics: [...(version.topics ?? []), { sourceID: newDiagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }] }
          : { components: [...(version.components ?? []), { sourceID: newDiagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }] }
      ),

      this.server.processAs(
        creatorID,
        Realtime.diagram.crud.add({
          key: newDiagram.id,
          value: newDiagram,
          versionID: payload.versionID,
          projectID: payload.projectID,
          workspaceID: payload.workspaceID,
        })
      ),

      this.reloadSharedNodes(ctx, payload, newDBDiagram),
    ]);

    return newDiagram;
  });
}

export default DuplicateDiagram;
