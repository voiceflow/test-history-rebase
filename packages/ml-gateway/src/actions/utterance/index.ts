import { LoguxControlOptions } from '@/control';

import SuggestUtteranceControl from './suggest';

const buildUtteranceActionControls = (options: LoguxControlOptions) => ({
  suggestUtteranceControl: new SuggestUtteranceControl(options),
});

export default buildUtteranceActionControls;
