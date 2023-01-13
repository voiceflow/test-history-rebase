import { LoguxControlOptions } from '@/control';

import AddUnclassifiedDataControl from './add';
import ReloadUnclassifiedDataControl from './reload';
import RemoveUnclassifiedDataControl from './remove';

const buildNluActionControls = (options: LoguxControlOptions) => ({
  addUnclassifiedDataControl: new AddUnclassifiedDataControl(options),
  deleteUnclassifiedDataControl: new RemoveUnclassifiedDataControl(options),
  reloadUnclassifiedDataControl: new ReloadUnclassifiedDataControl(options),
});

export default buildNluActionControls;
