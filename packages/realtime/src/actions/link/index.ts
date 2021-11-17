import { LoguxControlOptions } from '@/control';

import AddLinkControl from './add';
import RemoveLinkControl from './remove';
import UpdateLinkDataControl from './updateData';

const buildLinkActionControls = (options: LoguxControlOptions) => ({
  addLinkControl: new AddLinkControl(options),
  removeLinkControl: new RemoveLinkControl(options),
  updateLinkDataControl: new UpdateLinkDataControl(options),
});

export default buildLinkActionControls;
