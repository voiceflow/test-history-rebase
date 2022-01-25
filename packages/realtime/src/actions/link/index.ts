import { LoguxControlOptions } from '@/control';

import AddLinkControl from './add';
import RemoveLinkControl from './remove';

const buildLinkActionControls = (options: LoguxControlOptions) => ({
  addLinkControl: new AddLinkControl(options),
  removeLinkControl: new RemoveLinkControl(options),
});

export default buildLinkActionControls;
