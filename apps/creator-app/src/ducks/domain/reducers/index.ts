import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import topicAdd from './topicAdd';
import topicMoveDomain from './topicMoveDomain';
import topicRemove from './topicRemove';
import topicReorder from './topicReorder';

const domainReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .mimerCase(...topicAdd)
  .mimerCase(...topicRemove)
  .mimerCase(...topicReorder)
  .mimerCase(...topicMoveDomain)
  .build();

export default domainReducer;
