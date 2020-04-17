import { State } from './types';

export * from './events';
export * from './selectors';
export * from './constants';

const INITIAL_STATE: State = {};

const trackingReducer = (state = INITIAL_STATE) => state;

export default trackingReducer;
