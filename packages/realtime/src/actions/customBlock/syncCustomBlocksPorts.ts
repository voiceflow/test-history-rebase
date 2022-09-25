import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

class SyncCustomBlockPorts extends AbstractProjectChannelControl<Realtime.port.SyncCustomBlockPortsPayload> {
  protected actionCreator = Realtime.port.syncCustomBlockPorts;

  protected process = async (_cxt: Context, { payload }: Action<Realtime.port.SyncCustomBlockPortsPayload>): Promise<void> => {
    const { diagramID, patchData } = payload;
    await this.services.diagram.syncCustomBlockPorts(diagramID, patchData);
  };
}

export default SyncCustomBlockPorts;
