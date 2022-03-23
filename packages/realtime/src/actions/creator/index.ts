import { LoguxControlOptions } from '@/control';

import ImportSnapshotControl from './importSnapshot';

const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  importSnapshotControl: new ImportSnapshotControl(options),
});

export default buildDiagramActionControls;
