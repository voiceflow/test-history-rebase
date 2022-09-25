import { LoguxControlOptions } from '@/control';

import AddCustomBlockControl from './add';
import RemoveCustomBlockControl from './remove';
import UpdateCustomBlockControl from './update';

const buildCustomBlockCRUDActionControls = (options: LoguxControlOptions) => ({
  crudAddCustomBlockControl: new AddCustomBlockControl(options),
  crudRemoveCustomBlockControl: new RemoveCustomBlockControl(options),
  crudUpdateCustomBlockControl: new UpdateCustomBlockControl(options),
});

export default buildCustomBlockCRUDActionControls;
