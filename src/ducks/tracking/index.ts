import { TrackingState } from './types';

export * from './events';
export * from './selectors';
export * from './constants';

const INITIAL_STATE: TrackingState = {};

const trackingReducer = (state = INITIAL_STATE) => state;

export default trackingReducer;
