import { Actions } from '@voiceflow/sdk-logux-designer';

import { referenceVirtualUpdateAtTransducerFactory, virtualUpdateAtTransducerFactory } from '../utils/virtual-update-at-transducer.util';
import { STATE_KEY as FUNCTION_STATE_KEY } from './function.state';
import { STATE_KEY as FUNCTION_PATH_STATE_KEY } from './function-path/function-path.state';
import { STATE_KEY as FUNCTION_VARIABLE_STATE_KEY } from './function-variable/function-variable.state';

export const functionUpdateAtTransducer = virtualUpdateAtTransducerFactory(
  referenceVirtualUpdateAtTransducerFactory({
    actions: Actions.FunctionPath,
    getRootID: (entityVariant) => entityVariant.functionID,
    rootStateKey: FUNCTION_STATE_KEY,
    referenceStateKey: FUNCTION_PATH_STATE_KEY,
  }),
  referenceVirtualUpdateAtTransducerFactory({
    actions: Actions.FunctionVariable,
    getRootID: (entityVariant) => entityVariant.functionID,
    rootStateKey: FUNCTION_STATE_KEY,
    referenceStateKey: FUNCTION_VARIABLE_STATE_KEY,
  })
);
