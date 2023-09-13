import { LoguxControlOptions } from '@/control';

import AddDiagramControl from './add';
import AddManyDiagramControl from './addMany';
import { ComponentCreateControl, ComponentDuplicateControl, ComponentRemoveControl } from './component';
import HeartbeatDiagramControl from './heartbeat';
import { LockEntitiesControl, UnlockEntitiesControl, UpdateLockedEntitiesControl } from './locks';
import { AddMenuItemControl, RemoveMenuItemControl, ReorderMenuItemControl, ReorderMenuNodeControl } from './menuItem';
import PatchDiagramControl from './patch';
import ReloadSharedNodesControl from './reloadSharedNodes';
import RemoveDiagramControl from './remove';
import RemoveManyDiagramControl from './removeMany';
import { SubtopicCreateControl, SubtopicMoveControl, SubtopicRemoveControl } from './subtopic';
import TemplateCreateControl from './templateCreate';
import { AddLocalVariableControl, RemoveLocalVariableControl } from './variable';
import { UpdateViewportControl } from './viewport';

const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  // crud
  addDiagramControl: new AddDiagramControl(options),
  patchDiagramControl: new PatchDiagramControl(options),
  removeDiagramControl: new RemoveDiagramControl(options),
  addManyDiagramControl: new AddManyDiagramControl(options),
  removeManyDiagramControl: new RemoveManyDiagramControl(options),

  // components
  componentCreateControl: new ComponentCreateControl(options),
  componentRemoveControl: new ComponentRemoveControl(options),
  componentDuplicateControl: new ComponentDuplicateControl(options),

  // subtopics
  subtopicCreateControl: new SubtopicCreateControl(options),
  subtopicRemoveControl: new SubtopicRemoveControl(options),
  subtopicMoveControl: new SubtopicMoveControl(options),

  // variables
  addLocalVariableControl: new AddLocalVariableControl(options),
  removeLocalVariableControl: new RemoveLocalVariableControl(options),

  // awareness
  lockEntitiesControl: new LockEntitiesControl(options),
  unlockEntitiesControl: new UnlockEntitiesControl(options),
  heartbeatDiagramControl: new HeartbeatDiagramControl(options),
  updateLockedEntitiesControl: new UpdateLockedEntitiesControl(options),

  // viewport
  updateViewportControl: new UpdateViewportControl(options),

  // menu items
  addMenuItemControl: new AddMenuItemControl(options),
  removeMenuItemControl: new RemoveMenuItemControl(options),
  reorderMenuItemControl: new ReorderMenuItemControl(options),
  reorderMenuNodeControl: new ReorderMenuNodeControl(options),

  // other
  templateCreateControl: new TemplateCreateControl(options),
  reloadSharedNodesControl: new ReloadSharedNodesControl(options),
});

export default buildDiagramActionControls;
