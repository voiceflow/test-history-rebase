import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type AddIntentPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Intent>;

class AddIntent extends AbstractVersionResourceControl<AddIntentPayload> {
  protected actionCreator = Realtime.intent.crud.add;

  protected process = async (ctx: Context, { payload }: Action<AddIntentPayload>) => {
    const { creatorID } = ctx.data;
    const projectType = await this.services.project.getProjectType(creatorID, payload.projectID);

    await this.services.intent.create(creatorID, payload.versionID, {
      ...Realtime.Adapters.getProjectTypeIntentAdapter<any>(projectType).toDB(payload.value),
      key: payload.key,
    });
  };
}

export default AddIntent;
