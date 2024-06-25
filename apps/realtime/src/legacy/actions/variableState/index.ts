import type { LoguxControlOptions } from '../../control';
import AddVariableStateControl from './add';
import CreateVariableStateControl from './create';
import DeleteVariableStateControl from './delete';
import PatchVariableStateControl from './patch';

const buildVariableStateActionControls = (options: LoguxControlOptions) => ({
  addVariableStateControl: new AddVariableStateControl(options),
  createVariableStateControl: new CreateVariableStateControl(options),
  patchVariableStateControl: new PatchVariableStateControl(options),
  deleteVariableStateControl: new DeleteVariableStateControl(options),
});

export default buildVariableStateActionControls;
