import { LoguxControlOptions } from '@/control';

import AddDiagramControl from './add';
import ConvertToTopicControl from './convertToTopic';
import CreateComponentControl from './createComponent';
import CreateTemplateControl from './createTemplateDiagram';
import CreateTopicControl from './createTopic';
import DuplicateDiagramControl from './duplicate';
import HeartbeatDiagramControl from './heartbeat';
import { LockEntitiesControl, UnlockEntitiesControl, UpdateLockedEntitiesControl } from './locks';
import PatchDiagramControl from './patch';
import ReloadSharedNodesControl from './reloadSharedNodes';
import RemoveDiagramControl from './remove';
import ReorderMenuNodeControl from './reorderMenuNode';
import { AddLocalVariableControl, RemoveLocalVariableControl } from './variable';
import { UpdateViewportControl } from './viewport';

const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  addDiagramControl: new AddDiagramControl(options),
  createTopicControl: new CreateTopicControl(options),
  patchDiagramControl: new PatchDiagramControl(options),
  removeDiagramControl: new RemoveDiagramControl(options),
  createTemplateControl: new CreateTemplateControl(options),
  convertToTopicControl: new ConvertToTopicControl(options),
  createComponentControl: new CreateComponentControl(options),
  duplicateDiagramControl: new DuplicateDiagramControl(options),

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
  reorderMenuNodeControl: new ReorderMenuNodeControl(options),
  reloadSharedNodesControl: new ReloadSharedNodesControl(options),
});

export default buildDiagramActionControls;
