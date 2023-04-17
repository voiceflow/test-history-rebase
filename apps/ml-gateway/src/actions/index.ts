import { LoguxControlOptions } from '@/control';

import buildIntentActionControls from './intent';
import buildUnclassifiedActionControls from './unclassified';
import buildUtteranceActionControls from './utterance';

export type ActionMap = ReturnType<typeof buildActions>;

const buildActions = (options: LoguxControlOptions) => ({
  ...buildUnclassifiedActionControls(options),
  ...buildUtteranceActionControls(options),
  ...buildIntentActionControls(options),
});

export default buildActions;
