import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl, NewDiagramContextData } from './utils';

class CreateTemplateDiagram extends AbstractDiagramResourceControl<Realtime.diagram.CreateDiagramPayload, NewDiagramContextData> {
  protected actionCreator = Realtime.diagram.createTemplateDiagram.started;

  protected process = this.reply(Realtime.diagram.createTemplateDiagram, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const [diagram] = await Promise.all([
      this.createDiagram(ctx, payload, {
        ...Realtime.Utils.diagram.templateDiagramFactory(payload.diagram.name),
        ...payload.diagram,
      }),
    ]);

    await this.services.version.patch(creatorID, payload.versionID, {
      templateDiagramID: diagram.id,
    });

    return diagram;
  });
}

export default CreateTemplateDiagram;
