import { LoguxControlOptions } from '@/control';

import AddSlotControl from './add';
import AddManySlotControl from './addMany';
import PatchSlotControl from './patch';
import RemoveSlotControl from './remove';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildSlotActionControls = (options: LoguxControlOptions) => ({
  addSlotControl: new AddSlotControl(options),
  addManySlotControl: new AddManySlotControl(options),
  patchSlotControl: new PatchSlotControl(options),
  removeSlotControl: new RemoveSlotControl(options),
});

export default buildSlotActionControls;

export type SlotActionControlMap = ReturnType<typeof buildSlotActionControls>;
