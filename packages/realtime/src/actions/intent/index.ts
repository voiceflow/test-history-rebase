import { LoguxControlOptions } from '@/control';

import AddIntentControl from './add';
import AddManyIntentsControl from './addMany';
import PatchIntentControl from './patch';
import RemoveIntentControl from './remove';

const buildIntentActionControls = (options: LoguxControlOptions) => ({
  addIntentControl: new AddIntentControl(options),
  addManyIntentsControl: new AddManyIntentsControl(options),
  patchIntentControl: new PatchIntentControl(options),
  removeIntentControl: new RemoveIntentControl(options),
});

export default buildIntentActionControls;
