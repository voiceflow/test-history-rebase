import { LoguxControlOptions } from '@/control';

import AddDiagramControl from './add';
import AddBlocksControl from './addBlocks';
import CreateComponentControl from './createComponent';
import CreateTopicControl from './createTopic';
import DragBlocksControl from './dragBlocks';
import DuplicateDiagramControl from './duplicate';
import { RegisterIntentStepsControl, ReorderIntentStepsControl, UpdateIntentStepsControl } from './intentSteps';
import MoveBlocksControl from './moveBlocks';
import MoveCursorControl from './moveCursor';
import PatchDiagramControl from './patch';
import RemoveDiagramControl from './remove';
import RemoveBlockControl from './removeBlocks';
import { AddLocalVariableControl, RemoveLocalVariableControl } from './variable';

const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  addDiagramControl: new AddDiagramControl(options),
  createComponentControl: new CreateComponentControl(options),
  createTopicControl: new CreateTopicControl(options),
  duplicateDiagramControl: new DuplicateDiagramControl(options),
  removeDiagramControl: new RemoveDiagramControl(options),

  // nodes
  addBlocksControl: new AddBlocksControl(options),
  dragBlocksControl: new DragBlocksControl(options),
  moveBlocksControl: new MoveBlocksControl(options),
  patchDiagramControl: new PatchDiagramControl(options),
  removeBlockControl: new RemoveBlockControl(options),

  // variables
  addLocalVariableControl: new AddLocalVariableControl(options),
  removeLocalVariableControl: new RemoveLocalVariableControl(options),

  // intent steps
  registerIntentStepsControl: new RegisterIntentStepsControl(options),
  reorderIntentStepsControl: new ReorderIntentStepsControl(options),
  updateIntentStepsControl: new UpdateIntentStepsControl(options),

  // awareness
  moveCursorControl: new MoveCursorControl(options),
});

export default buildDiagramActionControls;
