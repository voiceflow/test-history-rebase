import { LoguxControlOptions } from '@/control';

import buildUtteranceActionControls from './utterance';

export type ActionMap = ReturnType<typeof buildActions>;

const buildActions = (options: LoguxControlOptions) => ({
  ...buildUtteranceActionControls(options),
});

export default buildActions;
