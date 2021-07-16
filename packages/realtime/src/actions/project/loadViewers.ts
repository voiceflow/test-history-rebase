import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { NoopProjectActionControl } from './utils';

class LoadProjectViewers extends NoopProjectActionControl<ActionCreatorPayload<typeof Realtime.project.loadViewers>> {
  actionCreator = Realtime.project.loadViewers;
}

export default LoadProjectViewers;
