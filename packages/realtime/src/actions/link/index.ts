import { LoguxControlOptions } from '@/control';

import AddLinkControl from './add';
import RemoveLinkControl from './remove';
import UpdateLinkDataControl from './updateData';

export interface LinkActionControlMap {
  addLinkControl: AddLinkControl;
  removeLinkControl: RemoveLinkControl;
  updateLinkDataControl: UpdateLinkDataControl;
}

const buildLinkActionControls = (options: LoguxControlOptions): LinkActionControlMap => ({
  addLinkControl: new AddLinkControl(options),
  removeLinkControl: new RemoveLinkControl(options),
  updateLinkDataControl: new UpdateLinkDataControl(options),
});

export default buildLinkActionControls;
