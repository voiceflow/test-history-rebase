import { compositeReducer } from '@/ducks/utils';

import metaReducer from './meta';
import publishInfoReducer from './publishInfo';
import skillReducer from './skill';

export * from './meta';
export * from './publishInfo';
export * from './sideEffects';
export * from './skill';

export default compositeReducer(skillReducer, { publishInfo: publishInfoReducer, meta: metaReducer });
