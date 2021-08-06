import { LoguxControlOptions } from '../../control';
import AppendPortControl from './appendPort';
import AppendStepControl from './appendStep';
import InsertStepControl from './insertStep';
import RemovePortControl from './removePort';
import RemoveStepControl from './removeStep';
import UpdateNodeDataControl from './updateData';

export interface NodeActionControlMap {
  appendPortControl: AppendPortControl;
  appendStepControl: AppendStepControl;
  insertStepControl: InsertStepControl;
  removePortControl: RemovePortControl;
  removeStepControl: RemoveStepControl;
  updateNodeDataControl: UpdateNodeDataControl;
}

const buildNodeActionControls = (options: LoguxControlOptions): NodeActionControlMap => ({
  appendPortControl: new AppendPortControl(options),
  appendStepControl: new AppendStepControl(options),
  insertStepControl: new InsertStepControl(options),
  removePortControl: new RemovePortControl(options),
  removeStepControl: new RemoveStepControl(options),
  updateNodeDataControl: new UpdateNodeDataControl(options),
});

export default buildNodeActionControls;
