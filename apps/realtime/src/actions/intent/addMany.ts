import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface AddManyIntentsPayload
  extends Realtime.intent.BaseIntentPayload,
    Realtime.actionUtils.CRUDValuesPayload<Platform.Base.Models.Intent.Model> {}

class AddManyIntents extends AbstractVersionResourceControl<AddManyIntentsPayload> {
  protected actionCreator = Realtime.intent.crud.addMany;

  protected process = async (_ctx: Context, { payload }: Action<AddManyIntentsPayload>) => {
    const { versionID, values, projectMeta } = payload;

    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    await this.services.intent.createMany(versionID, projectConfig.adapters.intent.simple.mapToDB(values));
  };

  protected finally = async (ctx: Context, { payload }: Action<AddManyIntentsPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default AddManyIntents;
