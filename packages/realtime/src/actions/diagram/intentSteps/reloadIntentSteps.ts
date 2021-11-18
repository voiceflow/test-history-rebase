import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from '../utils';

class ReloadIntentSteps extends AbstractDiagramResourceControl<Realtime.diagram.ReloadIntentStepsPayload> {
  protected actionCreator = Realtime.diagram.reloadIntentSteps;

  protected process = Utils.functional.noop;
}

export default ReloadIntentSteps;
