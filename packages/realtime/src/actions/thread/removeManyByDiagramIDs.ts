import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

class PatchThread extends AbstractProjectChannelControl<Realtime.thread.RemoveManyByDiagramIDsPayload> {
  protected actionCreator = Realtime.thread.removeManyByDiagramIDs;

  protected process = async (ctx: Context, { payload }: Action<Realtime.thread.RemoveManyByDiagramIDsPayload>) => {
    const { creatorID } = ctx.data;
    const { projectID, diagramIDs } = payload;

    await this.services.thread.removeManyByDiagramIDs(creatorID, projectID, diagramIDs);
  };
}

export default PatchThread;
