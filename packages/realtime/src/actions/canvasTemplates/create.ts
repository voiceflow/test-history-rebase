import * as Realtime from '@voiceflow/realtime-sdk';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class CreateCanvasTemplate extends AbstractVersionResourceControl<Realtime.canvasTemplate.CreateCanvasTemplatePayload> {
  protected actionCreator = Realtime.canvasTemplate.create.started;

  protected resend = terminateResend;

  process = this.reply(Realtime.canvasTemplate.create, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { canvasTemplate, versionID, projectID, workspaceID } = payload;

    const newCanvasTemplate = await this.services.canvasTemplate
      .create(versionID, { ...canvasTemplate })
      .then(Realtime.Adapters.canvasTemplateAdapter.fromDB);

    await this.server.processAs(
      creatorID,
      Realtime.canvasTemplate.crud.add({
        key: newCanvasTemplate.id,
        value: newCanvasTemplate,
        versionID,
        projectID,
        workspaceID,
      })
    );

    return newCanvasTemplate;
  });
}

export default CreateCanvasTemplate;
