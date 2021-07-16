import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { NoopProjectActionControl } from './utils';

class UpdateProjectViewers extends NoopProjectActionControl<ActionCreatorPayload<typeof Realtime.project.updateViewers>> {
  actionCreator = Realtime.project.updateViewers;
}

export default UpdateProjectViewers;
