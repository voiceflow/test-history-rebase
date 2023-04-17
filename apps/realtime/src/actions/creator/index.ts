import { LoguxControlOptions } from '@/control';

import ImportSnapshotControl from './importSnapshot';
import InitializeControl from './initialize';

const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  importSnapshotControl: new ImportSnapshotControl(options),
  initializeControl: new InitializeControl(options),
});

export default buildDiagramActionControls;
