import { LoguxControlOptions } from '@/control';

import ClusterUtterancesControl from './cluster';
import SuggestUtteranceControl from './findSimilar';

const buildUtteranceActionControls = (options: LoguxControlOptions) => ({
  findSimilarUtterancesControl: new SuggestUtteranceControl(options),
  clusterUtterancesControl: new ClusterUtterancesControl(options),
});

export default buildUtteranceActionControls;
