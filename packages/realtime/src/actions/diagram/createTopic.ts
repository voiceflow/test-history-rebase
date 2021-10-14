import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from './utils';

class CreateTopic extends AbstractDiagramResourceControl<Realtime.diagram.CreateDiagramPayload> {
  protected actionCreator = Realtime.diagram.createTopic.started;

  protected process = this.reply(Realtime.diagram.createTopic, (ctx, { payload }) =>
    this.createDiagram(ctx, payload, Realtime.Utils.diagram.topicDiagramFactory(payload.name))
  );
}

export default CreateTopic;
