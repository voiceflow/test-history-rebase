import { LoguxControlOptions } from '../../control';
import PatchVersionPublishingControl from './patchPublishing';
import PatchVersionSessionControl from './patchSession';
import PatchVersionSettingsControl from './patchSettings';
import ReorderComponentsControl from './reorderComponents';
import ReorderTopicsControl from './reorderTopics';
import { AddGlobalVariableControl, RemoveGlobalVariableControl } from './variable';

const buildVersionActionControls = (options: LoguxControlOptions) => ({
  reorderTopicsControl: new ReorderTopicsControl(options),
  reorderComponentsControl: new ReorderComponentsControl(options),
  patchVersionSessionControl: new PatchVersionSessionControl(options),
  patchVersionSettingsControl: new PatchVersionSettingsControl(options),
  patchVersionPublishingControl: new PatchVersionPublishingControl(options),

  // variables
  addGlobalVariableControl: new AddGlobalVariableControl(options),
  removeGlobalVariableControl: new RemoveGlobalVariableControl(options),
});

export default buildVersionActionControls;
