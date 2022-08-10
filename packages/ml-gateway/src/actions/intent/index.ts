import { LoguxControlOptions } from '@/control';

import IntentClarityActionControl from './clarity';

const buildIntentActionControls = (options: LoguxControlOptions) => ({
  intentClarityActionControl: new IntentClarityActionControl(options),
});

export default buildIntentActionControls;
