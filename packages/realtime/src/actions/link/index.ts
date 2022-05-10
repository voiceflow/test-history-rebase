import { LoguxControlOptions } from '@/control';

import AddBuiltinLinkControl from './addBuiltin';
import AddDynamicLinkControl from './addDynamic';
import PatchManyLinksControl from './patchMany';
import RemoveManyLinksControl from './removeMany';

const buildLinkActionControls = (options: LoguxControlOptions) => ({
  addBuiltinLinkControl: new AddBuiltinLinkControl(options),
  addDynamicLinkControl: new AddDynamicLinkControl(options),
  patchManyLinksControl: new PatchManyLinksControl(options),
  removeManyLinksControl: new RemoveManyLinksControl(options),
});

export default buildLinkActionControls;
