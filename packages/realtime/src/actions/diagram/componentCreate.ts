import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class ComponentCreate extends AbstractDiagramResourceControl<Realtime.diagram.ComponentCreatePayload> {
  protected actionCreator = Realtime.diagram.componentCreate.started;

  protected process = this.reply(Realtime.diagram.componentCreate, async (ctx, { payload }) => this.createComponent(ctx, payload, payload.component));
}

export default ComponentCreate;
