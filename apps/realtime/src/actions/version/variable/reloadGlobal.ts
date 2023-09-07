import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractVersionResourceControl } from '../utils';

class ReloadGlobalVariables extends AbstractVersionResourceControl<Realtime.version.variable.GlobalManyVariablesPayload> {
  protected actionCreator = Realtime.version.variable.reloadGlobal;

  protected process = Utils.functional.noop;
}

export default ReloadGlobalVariables;
