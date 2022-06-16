import { LoguxControlOptions } from '../../control';
import AddBlockControl from './addBlock';
import AddMarkupControl from './addMarkup';
import InsertStepControl from './insertStep';
import IsolateStepsControl from './isolateSteps';
import MoveManyNodesControl from './moveMany';
import RemoveManyNodesControl from './removeMany';
import ReorderStepsControl from './reorderSteps';
import TransplantStepControl from './transplantSteps';
import UpdateManyNodeDataControl from './updateManyData';

const buildNodeActionControls = (options: LoguxControlOptions) => ({
  moveManyNodesControl: new MoveManyNodesControl(options),
  removeManyNodesControl: new RemoveManyNodesControl(options),
  updateManyNodeDataControl: new UpdateManyNodeDataControl(options),

  // blocks
  addBlockControl: new AddBlockControl(options),

  // markup
  addMarkupControl: new AddMarkupControl(options),

  // steps
  insertStepControl: new InsertStepControl(options),
  IsolateStepsControl: new IsolateStepsControl(options),
  transplantStepsControl: new TransplantStepControl(options),
  reorderStepsControl: new ReorderStepsControl(options),
});

export default buildNodeActionControls;
