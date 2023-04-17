import { LoguxControlOptions } from '@/control';

import AddIntentControl from './add';
import AddManyIntentsControl from './addMany';
import PatchIntentControl from './patch';
import RefreshIntentControl from './refresh';
import ReloadIntentsControl from './reload';
import RemoveIntentControl from './remove';
import RemoveManyIntentsControl from './removeMany';

const buildIntentActionControls = (options: LoguxControlOptions) => ({
  addIntentControl: new AddIntentControl(options),
  patchIntentControl: new PatchIntentControl(options),
  removeIntentControl: new RemoveIntentControl(options),
  removeManyIntentsControl: new RemoveManyIntentsControl(options),
  refreshIntentControl: new RefreshIntentControl(options),
  reloadIntentsControl: new ReloadIntentsControl(options),
  addManyIntentsControl: new AddManyIntentsControl(options),
});

export default buildIntentActionControls;
