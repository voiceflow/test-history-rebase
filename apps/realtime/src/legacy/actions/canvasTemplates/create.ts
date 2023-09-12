import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

class CreateCanvasTemplate extends AbstractVersionResourceControl<Realtime.canvasTemplate.CreateCanvasTemplatePayload> {
  protected actionCreator = Realtime.canvasTemplate.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.canvasTemplate.create, async (ctx, { payload }) => {
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

  protected finally = async (ctx: Context, { payload }: Action<Realtime.canvasTemplate.CreateCanvasTemplatePayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default CreateCanvasTemplate;
