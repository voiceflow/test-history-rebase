import { LoguxControlOptions } from '../../control';
import AddVariableStateControl from './add';
import CreateVariableStateControl from './create';

const buildVariableStateActionControls = (options: LoguxControlOptions) => ({
  addVariableStateControl: new AddVariableStateControl(options),
  createVariableStateControl: new CreateVariableStateControl(options),
});

export default buildVariableStateActionControls;
