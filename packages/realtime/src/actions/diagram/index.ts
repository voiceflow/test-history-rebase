import { LoguxControlOptions } from '@/control';

import AddBlocksControl from './addBlocks';
import CreateComponentControl from './createComponent';
import CreateTopicControl from './createTopic';
import DragBlocksControl from './dragBlocks';
import DuplicateDiagramControl from './duplicate';
import MoveBlocksControl from './moveBlocks';
import MoveCursorControl from './moveCursor';
import RemoveDiagramControl from './remove';
import RemoveBlockControl from './removeBlocks';
import { AddLocalVariableControl, RemoveLocalVariableControl } from './variable';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  createComponentControl: new CreateComponentControl(options),
  createTopicControl: new CreateTopicControl(options),
  duplicateDiagramControl: new DuplicateDiagramControl(options),
  removeDiagramControl: new RemoveDiagramControl(options),

  // nodes
  addBlocksControl: new AddBlocksControl(options),
  dragBlocksControl: new DragBlocksControl(options),
  moveBlocksControl: new MoveBlocksControl(options),
  removeBlockControl: new RemoveBlockControl(options),

  // variables
  addLocalVariableControl: new AddLocalVariableControl(options),
  removeLocalVariableControl: new RemoveLocalVariableControl(options),

  // awareness
  moveCursorControl: new MoveCursorControl(options),
});

export default buildDiagramActionControls;

export type DiagramActionControlMap = ReturnType<typeof buildDiagramActionControls>;
