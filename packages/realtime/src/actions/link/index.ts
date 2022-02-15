import { LoguxControlOptions } from '@/control';

import AddLinkControl from './add';
import PatchManyLinksControl from './patchMany';
import RemoveManyLinksControl from './removeMany';

const buildLinkActionControls = (options: LoguxControlOptions) => ({
  addLinkControl: new AddLinkControl(options),
  patchManyLinksControl: new PatchManyLinksControl(options),
  removeManyLinksControl: new RemoveManyLinksControl(options),
});

export default buildLinkActionControls;
