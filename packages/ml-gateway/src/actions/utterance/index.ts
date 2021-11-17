import { LoguxControlOptions } from '@/control';

import SuggestUtteranceControl from './suggest';

const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  suggestUtteranceControl: new SuggestUtteranceControl(options),
});

export default buildDiagramActionControls;
