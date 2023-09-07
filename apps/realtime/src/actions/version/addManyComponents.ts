import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractVersionResourceControl } from './utils';

class AddManyComponents extends AbstractVersionResourceControl<Realtime.version.AddManyComponentsPayload> {
  protected actionCreator = Realtime.version.addManyComponents;

  protected process = Utils.functional.noop;
}

export default AddManyComponents;
