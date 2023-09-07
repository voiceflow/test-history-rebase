import { LoguxControlOptions } from '@/control';

import AddUnclassifiedDataControl from './add';
import ReloadUnclassifiedDataControl from './reload';
import RemoveUnclassifiedDataControl from './remove';
import RemoveManyUtterancesControl from './removeManyUtterances';
import UpdateManyUtterancesControl from './updateManyUtterances';

const buildNluActionControls = (options: LoguxControlOptions) => ({
  addUnclassifiedDataControl: new AddUnclassifiedDataControl(options),
  removeUnclassifiedDataControl: new RemoveUnclassifiedDataControl(options),
  reloadUnclassifiedDataControl: new ReloadUnclassifiedDataControl(options),
  removeManyUtterancesControl: new RemoveManyUtterancesControl(options),
  updateManyUtterancesControl: new UpdateManyUtterancesControl(options),
});

export default buildNluActionControls;
