import { LoguxControlOptions } from '@/control';

import AddDiagramControl from './add';
import ConvertToTopicControl from './convertToTopic';
import CreateComponentControl from './createComponent';
import CreateTopicControl from './createTopic';
import DuplicateDiagramControl from './duplicate';
import { RegisterIntentStepsControl, ReloadIntentStepsControl, ReorderIntentStepsControl, UpdateIntentStepsControl } from './intentSteps';
import MoveCursorControl from './moveCursor';
import PatchDiagramControl from './patch';
import RemoveDiagramControl from './remove';
import { AddLocalVariableControl, RemoveLocalVariableControl } from './variable';
import { UpdateViewportControl } from './viewport';

const buildDiagramActionControls = (options: LoguxControlOptions) => ({
  addDiagramControl: new AddDiagramControl(options),
  convertToTopicControl: new ConvertToTopicControl(options),
  createComponentControl: new CreateComponentControl(options),
  createTopicControl: new CreateTopicControl(options),
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

  // awareness
  moveCursorControl: new MoveCursorControl(options),

  // viewport
  updateViewportControl: new UpdateViewportControl(options),
});

export default buildDiagramActionControls;
