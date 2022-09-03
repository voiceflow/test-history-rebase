import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import topicAdd from './topicAdd';
import topicRemove from './topicRemove';
import topicReorder from './topicReorder';

const domainReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...topicAdd)
  .immerCase(...topicRemove)
  .immerCase(...topicReorder)
  .build();

export default domainReducer;
