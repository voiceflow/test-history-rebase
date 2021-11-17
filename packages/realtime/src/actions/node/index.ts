import { LoguxControlOptions } from '../../control';
import AppendPortControl from './appendPort';
import AppendStepControl from './appendStep';
import InsertStepControl from './insertStep';
import RemoveManyNodesControl from './removeMany';
import RemovePortControl from './removePort';
import UpdateNodeDataControl from './updateData';

const buildNodeActionControls = (options: LoguxControlOptions) => ({
  removeManyNodesControl: new RemoveManyNodesControl(options),
  updateNodeDataControl: new UpdateNodeDataControl(options),

  // steps
  appendStepControl: new AppendStepControl(options),
  insertStepControl: new InsertStepControl(options),

  // ports
  appendPortControl: new AppendPortControl(options),
  removePortControl: new RemovePortControl(options),
});

export default buildNodeActionControls;
