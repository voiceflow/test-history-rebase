import { LoguxControlOptions } from '@/control';

import CreateCustomBlockControl from './create';
import buildCustomBlockCRUDActionControls from './crud';
import RemoveCustomBlockControl from './remove';
import SyncCustomBlockPortsControl from './syncCustomBlocksPorts';
import UpdateCustomBlockControl from './update';

const buildCustomBlockActionControls = (options: LoguxControlOptions) => ({
  createCustomBlockControl: new CreateCustomBlockControl(options),
  removeCustomBlockControl: new UpdateCustomBlockControl(options),
  updateCustomBlockControl: new RemoveCustomBlockControl(options),
  syncCustomBlockPortsControl: new SyncCustomBlockPortsControl(options),
  ...buildCustomBlockCRUDActionControls(options),
});

export default buildCustomBlockActionControls;
