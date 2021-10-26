import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { ProductState } from '../types';
import crudReducers from './crud';

const productReducer = createRootCRUDReducer<ProductState>(INITIAL_STATE, crudReducers).build();

export default productReducer;
