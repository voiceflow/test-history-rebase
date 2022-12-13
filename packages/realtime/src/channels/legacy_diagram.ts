import * as Realtime from '@voiceflow/realtime-sdk';

import DiagramChannel from './diagram';

export interface DiagramChannelContextData {
  subscribed?: boolean;
}

/** @deprecated please remove me after 12/16/2022 */
class LegacyDiagramChannel extends DiagramChannel {
  protected channel = Realtime.Channels.legacyDiagram;
}

export default LegacyDiagramChannel;
