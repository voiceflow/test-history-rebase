import createCRUDReducer from '@/ducks/utils/crud';
import { Product } from '@/models';

import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';

const productReducer = createCRUDReducer<Product>(STATE_KEY);

export default productReducer;
