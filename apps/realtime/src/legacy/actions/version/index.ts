import type { LoguxControlOptions } from '../../control';
import PatchVersionDefaultStepColors from './patchDefaultStepColors';
import PatchVersionPublishingControl from './patchPublishing';
import PatchVersionSessionControl from './patchSession';
import PatchVersionSettingsControl from './patchSettings';

const buildVersionActionControls = (options: LoguxControlOptions) => ({
  patchVersionSessionControl: new PatchVersionSessionControl(options),
  patchVersionSettingsControl: new PatchVersionSettingsControl(options),
  patchVersionPublishingControl: new PatchVersionPublishingControl(options),
  patchVersionDefaultStepColors: new PatchVersionDefaultStepColors(options),
});

export default buildVersionActionControls;
