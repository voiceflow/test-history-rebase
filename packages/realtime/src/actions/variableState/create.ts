import * as Realtime from '@voiceflow/realtime-sdk';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class CreateVariableState extends AbstractVersionResourceControl<Realtime.variableState.CreateVariableStatePayload> {
  protected actionCreator = Realtime.variableState.create.started;

  protected resend = terminateResend;

  process = this.reply(Realtime.variableState.create, async ({ data }, { payload }) => {
    const { creatorID } = data;

    const variableState = await this.services.variableState
      .create(creatorID, Realtime.Adapters.variableStateAdapter.toDB({ ...payload.variableState }))
      .then(Realtime.Adapters.variableStateAdapter.fromDB);

    await this.server.processAs(
      creatorID,
      Realtime.variableState.crud.add({
        key: variableState.id,
        value: variableState,
        versionID: payload.versionID,
        projectID: payload.projectID,
        workspaceID: payload.workspaceID,
      })
    );

    return variableState;
  });
}

export default CreateVariableState;
