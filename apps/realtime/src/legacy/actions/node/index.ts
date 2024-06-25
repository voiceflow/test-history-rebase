import type { LoguxControlOptions } from '../../control';
import AddActionsControl from './addActions';
import AddBlockControl from './addBlock';
import AddMarkupControl from './addMarkup';
import InsertManyStepsControl from './insertManySteps';
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

  // actions
  addActionsControl: new AddActionsControl(options),

  // markup
  addMarkupControl: new AddMarkupControl(options),

  // steps
  insertStepControl: new InsertStepControl(options),
  insertManySteps: new InsertManyStepsControl(options),
  isolateStepsControl: new IsolateStepsControl(options),
  reorderStepsControl: new ReorderStepsControl(options),
  transplantStepsControl: new TransplantStepControl(options),
});

export default buildNodeActionControls;
