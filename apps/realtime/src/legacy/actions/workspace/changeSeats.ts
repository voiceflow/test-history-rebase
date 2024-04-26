import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from './utils';

class ChangeWorkspaceSeats extends AbstractWorkspaceChannelControl<Realtime.workspace.ChangeSeatsPayload> {
  protected actionCreator = Realtime.workspace.changeSeats;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.ChangeSeatsPayload>) => {
    const { seats, schedule, workspaceID } = payload;

    await this.services.workspace.changeSeats(ctx.data.creatorID, workspaceID, { seats, schedule });
  };
}

export default ChangeWorkspaceSeats;
