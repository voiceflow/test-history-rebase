import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class CreateComponent extends AbstractDiagramResourceControl<Realtime.diagram.CreateDiagramPayload> {
  protected actionCreator = Realtime.diagram.createComponent.started;

  protected process = this.reply(Realtime.diagram.createComponent, (ctx, { payload }) =>
    this.createDiagram(ctx, payload, Realtime.Utils.diagram.componentDiagramFactory(payload.name))
  );
}

export default CreateComponent;
