import type { LoguxControlOptions } from '@/legacy/control';

import buildCustomBlockCRUDActionControls from './crud';
import SyncCustomBlockPortsControl from './syncCustomBlocksPorts';

const buildCustomBlockActionControls = (options: LoguxControlOptions) => ({
  syncCustomBlockPortsControl: new SyncCustomBlockPortsControl(options),
  ...buildCustomBlockCRUDActionControls(options),
});

export default buildCustomBlockActionControls;
