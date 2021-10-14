import { LoguxControlOptions } from '@/control';

import AddIntentControl from './add';
import AddManyIntentsControl from './addMany';
import PatchIntentControl from './patch';
import RemoveIntentControl from './remove';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildIntentActionControls = (options: LoguxControlOptions) => ({
  addIntentControl: new AddIntentControl(options),
  addManyIntentsControl: new AddManyIntentsControl(options),
  patchIntentControl: new PatchIntentControl(options),
  removeIntentControl: new RemoveIntentControl(options),
});

export default buildIntentActionControls;

export type IntentActionControlMap = ReturnType<typeof buildIntentActionControls>;
