import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractVersionDiagramAccessActionControl } from '../utils';

class RemoveMenuItem extends AbstractVersionDiagramAccessActionControl<Realtime.diagram.BaseMenuItemPayload> {
  protected actionCreator = Realtime.diagram.removeMenuItem;

  protected process = Utils.functional.noop;
}

export default RemoveMenuItem;
