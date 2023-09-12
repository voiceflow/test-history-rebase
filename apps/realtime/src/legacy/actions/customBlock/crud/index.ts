import { LoguxControlOptions } from '@/legacy/control';

import AddCustomBlockControl from './add';
import AddManyCustomBlockControl from './addMany';
import RemoveCustomBlockControl from './remove';
import UpdateCustomBlockControl from './update';

const buildCustomBlockCRUDActionControls = (options: LoguxControlOptions) => ({
  crudAddCustomBlockControl: new AddCustomBlockControl(options),
  crudAddManyCustomBlockControl: new AddManyCustomBlockControl(options),
  crudRemoveCustomBlockControl: new RemoveCustomBlockControl(options),
  crudUpdateCustomBlockControl: new UpdateCustomBlockControl(options),
});

export default buildCustomBlockCRUDActionControls;
