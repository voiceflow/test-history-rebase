import { LoguxControlOptions } from '@/control';

import buildIntentActionControls from './intent';
import buildUtteranceActionControls from './utterance';

export type ActionMap = ReturnType<typeof buildActions>;

const buildActions = (options: LoguxControlOptions) => ({
  ...buildUtteranceActionControls(options),
  ...buildIntentActionControls(options),
});

export default buildActions;
