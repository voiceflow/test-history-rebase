import { LoguxControlOptions } from '@/control';

import AddUnclassifiedDataControl from './add';
import ReloadUnclassifiedDataControl from './reload';

const buildNluActionControls = (options: LoguxControlOptions) => ({
  addUnclassifiedDataControl: new AddUnclassifiedDataControl(options),
  reloadUnclassifiedDataControl: new ReloadUnclassifiedDataControl(options),
});

export default buildNluActionControls;
