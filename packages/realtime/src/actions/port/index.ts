import { LoguxControlOptions } from '../../control';
import AddBuiltinPortControl from './addBuiltin';
import AddByKeyPortControl from './addByKey';
import AddDynamicPortControl from './addDynamic';
import RemoveBuiltinPortControl from './removeBuiltin';
import RemoveDynamicPortControl from './removeDynamic';
import RemoveManyByKeyPortsControl from './removeManyByKey';
import ReorderDynamicPortControl from './reorderDynamic';

const buildPortActionControls = (options: LoguxControlOptions) => ({
  addByKeyPortControl: new AddByKeyPortControl(options),
  addDynamicPortControl: new AddDynamicPortControl(options),
  addBuiltinPortControl: new AddBuiltinPortControl(options),
  removeBuiltinPortControl: new RemoveBuiltinPortControl(options),
  removeDynamicPortControl: new RemoveDynamicPortControl(options),
  reorderDynamicPortControl: new ReorderDynamicPortControl(options),
  removeManyByKeyPortsControl: new RemoveManyByKeyPortsControl(options),
});

export default buildPortActionControls;
