import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class AddManyNotesControl extends AbstractVersionResourceControl<Realtime.note.AddManyPayload> {
  protected actionCreator = Realtime.note.addMany;

  protected process = Utils.functional.noop;
}

export default AddManyNotesControl;
