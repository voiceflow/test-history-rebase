import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class CreateTemplateDiagram extends AbstractDiagramResourceControl<Realtime.diagram.CreateDiagramPayload> {
  protected actionCreator = Realtime.diagram.createTemplateDiagram.started;

  protected process = this.reply(Realtime.diagram.createTemplateDiagram, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const dbDiagram = await this.services.diagram.create({
      ...Realtime.Utils.diagram.templateDiagramFactory(payload.diagram.name),
      ...payload.diagram,
      creatorID,
      versionID: payload.versionID,
    });

    const diagram = Realtime.Adapters.diagramAdapter.fromDB(dbDiagram);

    await Promise.all([
      this.services.version.patch(creatorID, payload.versionID, { templateDiagramID: diagram.id }),
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
    ]);

    return diagram;
  });
}

export default CreateTemplateDiagram;
