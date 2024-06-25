import { IO } from '@voiceflow/realtime-sdk/backend';

import type { AuthorizedCtx, AuthorizedSocket } from '../types';
import { AbstractEvent } from '../types';

class DiagramJoin extends AbstractEvent<AuthorizedCtx, IO.DiagramChannelData> {
  event = IO.Event.DIAGRAM_JOIN;

  handle = async (
    socket: AuthorizedSocket<AuthorizedCtx>,
    { versionID, diagramID }: Partial<IO.DiagramChannelData>
  ) => {
    if (!diagramID || !versionID) throw new Error('diagram join event requires diagramID');

    await socket.join(IO.diagramChannel(versionID + diagramID));
  };
}

export default DiagramJoin;
