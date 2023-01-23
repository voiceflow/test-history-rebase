import { LoguxControlOptions } from '@/control';

import AddUnclassifiedDataControl from './add';
import ReloadUnclassifiedDataControl from './reload';
import RemoveUnclassifiedDataControl from './remove';
import RemoveManyUtterancesControl from './removeManyUtterances';

const buildNluActionControls = (options: LoguxControlOptions) => ({
  addUnclassifiedDataControl: new AddUnclassifiedDataControl(options),
  deleteUnclassifiedDataControl: new RemoveUnclassifiedDataControl(options),
  reloadUnclassifiedDataControl: new ReloadUnclassifiedDataControl(options),
  removeManyUtterancesControl: new RemoveManyUtterancesControl(options),
});

export default buildNluActionControls;
