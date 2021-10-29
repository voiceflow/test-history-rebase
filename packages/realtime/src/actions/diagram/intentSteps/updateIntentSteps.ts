import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from '../utils';

class UpdateIntentSteps extends AbstractDiagramResourceControl<Realtime.diagram.UpdateIntentStepsPayload> {
  protected actionCreator = Realtime.diagram.updateIntentSteps;

  protected process = Realtime.Utils.functional.noop;
}

export default UpdateIntentSteps;
