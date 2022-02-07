import { LoguxControlOptions } from '../../control';
import AddBlockControl from './addBlock';
import AddBuiltinPortControl from './addBuiltinPort';
import AddDynamicPortControl from './addDynamicPort';
import AddMarkupControl from './addMarkup';
import AppendStepControl from './appendStep';
import DragManyNodesControl from './dragMany';
import InsertStepControl from './insertStep';
import MoveManyNodesControl from './moveMany';
import RemoveManyNodesControl from './removeMany';
import RemovePortControl from './removePort';
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

  // ports
  addDynamicPortControl: new AddDynamicPortControl(options),
  addBuiltinPortControl: new AddBuiltinPortControl(options),
  removePortControl: new RemovePortControl(options),
});

export default buildNodeActionControls;
