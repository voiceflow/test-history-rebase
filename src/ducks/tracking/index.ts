import { TrackingState } from './types';

export * from './constants';
export * from './events';
export * from './selectors';

const INITIAL_STATE: TrackingState = {};

const trackingReducer = (state = INITIAL_STATE) => state;

export default trackingReducer;
