import { compositeReducer } from '@/ducks/utils';

import metaReducer from './meta';
import skillReducer from './skill';

export * from './meta';
export * from './sideEffects';
export * from './skill';

export default compositeReducer(skillReducer, { meta: metaReducer });
