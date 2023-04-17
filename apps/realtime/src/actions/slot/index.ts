import { LoguxControlOptions } from '@/control';

import AddSlotControl from './add';
import AddManySlotControl from './addMany';
import PatchSlotControl from './patch';
import RefreshSlotsControl from './refresh';
import ReloadSlotsControl from './reload';
import RemoveManySlotsControl from './removeMany';

const buildSlotActionControls = (options: LoguxControlOptions) => ({
  addSlotControl: new AddSlotControl(options),
  patchSlotControl: new PatchSlotControl(options),
  addManySlotControl: new AddManySlotControl(options),
  reloadSlotsControl: new ReloadSlotsControl(options),
  refreshSlotsControl: new RefreshSlotsControl(options),
  removeManySlotsControl: new RemoveManySlotsControl(options),
});

export default buildSlotActionControls;
