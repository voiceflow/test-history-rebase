import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type AddManyIntentsPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuesPayload<Realtime.Intent>;

class AddManyIntents extends AbstractVersionResourceControl<AddManyIntentsPayload> {
  protected actionCreator = Realtime.intent.crud.addMany;

  protected process = async (ctx: Context, { payload }: Action<AddManyIntentsPayload>) => {
    const { creatorID } = ctx.data;
    const projectType = await this.services.project.getProjectType(creatorID, payload.projectID);

    await this.services.intent.createMany(
      creatorID,
      payload.versionID,
      Realtime.Adapters.getProjectTypeIntentAdapter<any>(projectType).mapToDB(payload.values)
    );
  };
}

export default AddManyIntents;
