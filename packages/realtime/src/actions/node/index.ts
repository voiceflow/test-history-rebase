import { LoguxControlOptions } from '../../control';
import AddBlockControl from './addBlock';
import AddMarkupControl from './addMarkup';
import AppendStepControl from './appendStep';
import DragManyNodesControl from './dragMany';
import InsertStepControl from './insertStep';
import IsolateStepControl from './isolateStep';
import MoveManyNodesControl from './moveMany';
import RemoveManyNodesControl from './removeMany';
import ReorderStepsControl from './reorderSteps';
import TransplantStepControl from './transplantSteps';
import UpdateNodeDataControl from './updateData';

const buildNodeActionControls = (options: LoguxControlOptions) => ({
  dragManyNodesControl: new DragManyNodesControl(options),
  moveManyNodesControl: new MoveManyNodesControl(options),
  removeManyNodesControl: new RemoveManyNodesControl(options),
  updateNodeDataControl: new UpdateNodeDataControl(options),

  // blocks
  addBlockControl: new AddBlockControl(options),

  // markup
  addMarkupControl: new AddMarkupControl(options),

  // steps
  appendStepControl: new AppendStepControl(options),
  insertStepControl: new InsertStepControl(options),
  IsolateStepControl: new IsolateStepControl(options),
  transplantStepsControl: new TransplantStepControl(options),
  reorderStepsControl: new ReorderStepsControl(options),
});

export default buildNodeActionControls;
