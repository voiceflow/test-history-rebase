import { LoguxControlOptions } from '@/control';

import AddSlotControl from './add';
import AddManySlotControl from './addMany';
import PatchSlotControl from './patch';
import RefreshSlotsControl from './refresh';
import RemoveManySlotsControl from './removeMany';

const buildSlotActionControls = (options: LoguxControlOptions) => ({
  addSlotControl: new AddSlotControl(options),
  addManySlotControl: new AddManySlotControl(options),
  patchSlotControl: new PatchSlotControl(options),
  removeManySlotsControl: new RemoveManySlotsControl(options),
  refreshSlotsControl: new RefreshSlotsControl(options),
});

export default buildSlotActionControls;
