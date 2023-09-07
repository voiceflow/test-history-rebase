import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractVersionDiagramAccessActionControl } from '../utils';

class AddMenuItem extends AbstractVersionDiagramAccessActionControl<Realtime.diagram.AddMenuItemPayload> {
  protected actionCreator = Realtime.diagram.addMenuItem;

  protected process = Utils.functional.noop;
}

export default AddMenuItem;
