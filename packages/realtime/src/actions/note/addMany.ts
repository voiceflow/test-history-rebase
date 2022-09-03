import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class AddManyNotesControl extends AbstractVersionResourceControl<Realtime.note.AddManyPayload> {
  protected actionCreator = Realtime.note.addMany;

  process = Utils.functional.noop;
}

export default AddManyNotesControl;
