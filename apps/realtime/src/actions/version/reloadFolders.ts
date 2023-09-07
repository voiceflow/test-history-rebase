import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractVersionResourceControl } from './utils';

class ReloadFolders extends AbstractVersionResourceControl<Realtime.version.ReloadFoldersPayload> {
  protected actionCreator = Realtime.version.reloadFolders;

  protected process = Utils.functional.noop;
}

export default ReloadFolders;
