import { LoguxControlOptions } from '@/legacy/control';

import LoadAllWorkspaceFeaturesControl from './loadWorkspaceFeatures';

const buildFeatureActionControls = (options: LoguxControlOptions) => ({
  loadAllWorkspaceFeaturesControl: new LoadAllWorkspaceFeaturesControl(options),
});

export default buildFeatureActionControls;
