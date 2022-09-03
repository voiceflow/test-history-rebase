import { LoguxControlOptions } from '@/control';

import AddDiagramControl from './add';
import AddManyDiagramControl from './addMany';
import ComponentCreateControl from './componentCreate';
import ComponentDuplicateControl from './componentDuplicate';
import ComponentRemoveControl from './componentRemove';
import HeartbeatDiagramControl from './heartbeat';
import { LockEntitiesControl, UnlockEntitiesControl, UpdateLockedEntitiesControl } from './locks';
import PatchDiagramControl from './patch';
import ReloadSharedNodesControl from './reloadSharedNodes';
import RemoveDiagramControl from './remove';
import RemoveManyDiagramControl from './removeMany';
import ReorderMenuNodeControl from './reorderMenuNode';
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

  // other
  templateCreateControl: new TemplateCreateControl(options),
  reorderMenuNodeControl: new ReorderMenuNodeControl(options),
  reloadSharedNodesControl: new ReloadSharedNodesControl(options),
});

export default buildDiagramActionControls;
