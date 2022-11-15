import * as Platform from '@voiceflow/platform-config';
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
}

export default AddManyIntents;
