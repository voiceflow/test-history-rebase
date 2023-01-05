import { IO } from '@voiceflow/realtime-sdk/backend';

import { AbstractEvent, AuthorizedCtx, AuthorizedSocket } from '../types';

class DiagramJoin extends AbstractEvent<AuthorizedCtx, IO.DiagramChannelData> {
  event = IO.Event.DIAGRAM_JOIN;

  handle = async (socket: AuthorizedSocket<AuthorizedCtx>, { diagramID }: Partial<IO.DiagramChannelData>) => {
    if (!diagramID) throw new Error('diagram join event requires diagramID');

    await socket.join(IO.diagramChannel(diagramID));
  };
}

export default DiagramJoin;
