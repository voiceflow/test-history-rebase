import { LoguxControlOptions } from '@/control';

import AddDiagramControl from './add';
import ConvertToTopicControl from './convertToTopic';
import CreateComponentControl from './createComponent';
import CreateTemplateControl from './createTemplateDiagram';
import CreateTopicControl from './createTopic';
import DuplicateDiagramControl from './duplicate';
import HeartbeatDiagramControl from './heartbeat';
import { RegisterIntentStepsControl, ReloadIntentStepsControl, ReorderIntentStepsControl, UpdateIntentStepsControl } from './intentSteps';
import { LockEntitiesControl, UnlockEntitiesControl, UpdateLockedEntitiesControl } from './locks';
import PatchDiagramControl from './patch';
import RemoveDiagramControl from './remove';
import {
  AddNewStartingBlocksControl,
  RemoveDiagramStartingBlocksControl,
  RemoveStartingBlocksControl,
  UpdateStartingBlockControl,
} from './startingBlocks';
import { AddLocalVariableControl, RemoveLocalVariableControl } from './variable';
import { UpdateViewportControl } from './viewport';

const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  addDiagramControl: new AddDiagramControl(options),
  convertToTopicControl: new ConvertToTopicControl(options),
  createComponentControl: new CreateComponentControl(options),
  createTopicControl: new CreateTopicControl(options),
  createTemplateControl: new CreateTemplateControl(options),
  duplicateDiagramControl: new DuplicateDiagramControl(options),
  patchDiagramControl: new PatchDiagramControl(options),
  removeDiagramControl: new RemoveDiagramControl(options),

  // variables
  addLocalVariableControl: new AddLocalVariableControl(options),
  removeLocalVariableControl: new RemoveLocalVariableControl(options),

  // intent steps
  registerIntentStepsControl: new RegisterIntentStepsControl(options),
  reorderIntentStepsControl: new ReorderIntentStepsControl(options),
  updateIntentStepsControl: new UpdateIntentStepsControl(options),
  reloadIntentStepsControl: new ReloadIntentStepsControl(options),

  // starting blocks
  addNewStartingBlocksControl: new AddNewStartingBlocksControl(options),
  removeStartingBlocksControl: new RemoveStartingBlocksControl(options),
  updateStartingBlockControl: new UpdateStartingBlockControl(options),
  removeDiagramStartingBlocksControl: new RemoveDiagramStartingBlocksControl(options),

  // awareness
  lockEntitiesControl: new LockEntitiesControl(options),
  unlockEntitiesControl: new UnlockEntitiesControl(options),
  heartbeatDiagramControl: new HeartbeatDiagramControl(options),
  updateLockedEntitiesControl: new UpdateLockedEntitiesControl(options),

  // viewport
  updateViewportControl: new UpdateViewportControl(options),
});

export default buildDiagramActionControls;
