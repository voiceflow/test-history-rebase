import { createRootReducer } from '../../utils';
import { INITIAL_PROJECT_STATE } from '../constants';
import { RealtimeProjectState } from '../types';
import { forgetViewerReducer, identifyViewerReducer } from './awareness';
import resetReducer from './reset';

export * from './awareness';

const realtimeProjectReducer = createRootReducer<RealtimeProjectState>(INITIAL_PROJECT_STATE)
  .immerCase(...identifyViewerReducer)
  .immerCase(...forgetViewerReducer)
  .immerCase(...resetReducer)
  .build();

export default realtimeProjectReducer;
