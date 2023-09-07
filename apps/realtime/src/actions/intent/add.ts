import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface AddIntentPayload extends Realtime.intent.BaseIntentPayload, Realtime.actionUtils.CRUDValuePayload<Platform.Base.Models.Intent.Model> {}

class AddIntent extends AbstractVersionResourceControl<AddIntentPayload> {
  protected actionCreator = Realtime.intent.crud.add;

  protected process = async (_ctx: Context, { payload }: Action<AddIntentPayload>) => {
    const { versionID, key, value, projectMeta } = payload;

    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    await this.services.intent.create(versionID, {
      ...projectConfig.adapters.intent.simple.toDB(value),
      key,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<AddIntentPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default AddIntent;
