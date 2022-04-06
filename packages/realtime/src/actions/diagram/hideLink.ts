import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopDiagramActionControl } from './utils';

class HideLinkControl extends AbstractNoopDiagramActionControl<Realtime.diagram.awareness.BaseCursorPayload> {
  actionCreator = Realtime.diagram.awareness.hideLink;
}

export default HideLinkControl;
