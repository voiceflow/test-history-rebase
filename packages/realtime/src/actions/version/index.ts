import { LoguxControlOptions } from '../../control';
import PatchVersionPublishingControl from './patchPublishing';
import PatchVersionSessionControl from './patchSession';
import PatchVersionSettingsControl from './patchSettings';
import { AddGlobalVariableControl, RemoveGlobalVariableControl } from './variable';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildVersionActionControls = (options: LoguxControlOptions) => ({
  patchVersionPublishingControl: new PatchVersionPublishingControl(options),
  patchVersionSessionControl: new PatchVersionSessionControl(options),
  patchVersionSettingsControl: new PatchVersionSettingsControl(options),

  // variables
  addGlobalVariableControl: new AddGlobalVariableControl(options),
  removeGlobalVariableControl: new RemoveGlobalVariableControl(options),
});

export default buildVersionActionControls;

export type VersionActionControlMap = ReturnType<typeof buildVersionActionControls>;
