import { LoguxControlOptions } from '../../control';
import AddBlocksControl from './addBlocks';
import DragBlocksControl from './dragBlocks';
import MoveBlocksControl from './moveBlocks';
import MoveCursorControl from './moveCursor';
import RemoveBlocControl from './removeBlocks';

export type DiagramActionControlMap = {
  addBlocksControl: AddBlocksControl;
  dragBlocksControl: DragBlocksControl;
  moveBlocksControl: MoveBlocksControl;
  moveCursorControl: MoveCursorControl;
  removeBlocControl: RemoveBlocControl;
};

const buildDiagramActionControls = (options: LoguxControlOptions): DiagramActionControlMap => ({
  addBlocksControl: new AddBlocksControl(options),
  dragBlocksControl: new DragBlocksControl(options),
  moveBlocksControl: new MoveBlocksControl(options),
  moveCursorControl: new MoveCursorControl(options),
  removeBlocControl: new RemoveBlocControl(options),
});

export default buildDiagramActionControls;
