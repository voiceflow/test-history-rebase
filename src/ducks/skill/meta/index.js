import { compositeReducer } from '@/ducks/utils';

import fulfillmentReducer from './fulfillment';
import metaReducer from './meta';

export * from './meta';
export * from './fulfillment';

export default compositeReducer(metaReducer, { fulfillment: fulfillmentReducer });
