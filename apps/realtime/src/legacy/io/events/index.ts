import type { IOControlOptions } from '../../control';
import CursorMoveEvent from './cursorMove';
import DiagramJoinEvent from './diagramJoin';
import DiagramLeaveEvent from './diagramLeave';
import NodeDragManyEvent from './nodeDragMany';
import ThreadDragManyEvent from './threadDragMany';

const buildEvents = (options: IOControlOptions) => ({
  cursorMoveEvent: new CursorMoveEvent(options),
  diagramJoinEvent: new DiagramJoinEvent(options),
  diagramLeaveEvent: new DiagramLeaveEvent(options),
  nodeDragManyEvent: new NodeDragManyEvent(options),
  threadDragManyEvent: new ThreadDragManyEvent(options),
});

export type EventMap = ReturnType<typeof buildEvents>;

export default buildEvents;
