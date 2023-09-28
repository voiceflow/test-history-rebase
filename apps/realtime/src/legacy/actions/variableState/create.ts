import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

class CreateVariableState extends AbstractVersionResourceControl<Realtime.variableState.CreateVariableStatePayload> {
  protected actionCreator = Realtime.variableState.create.started;

  protected resend = terminateResend;

  process = this.reply(Realtime.variableState.create, async ({ data }, { payload }) => {
    const { creatorID, clientID } = data;

    const variableState = await this.services.variableState
      .create(creatorID, payload.variableState as Omit<Realtime.DBVariableState, '_id'>)
      .then(Realtime.Adapters.variableStateAdapter.fromDB);

    await this.server.processAs(
      creatorID,
      clientID,
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
