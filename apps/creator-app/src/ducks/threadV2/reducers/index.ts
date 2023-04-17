import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { addCommentReducer, deleteCommentReducer, updateCommentReducer, updateUnreadCommentsReducer } from './comments';
import crudReducers from './crud';
import removeManyByDiagramIDsReducer from './removeManyByDiagramIDs';

const threadReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...addCommentReducer)
  .immerCase(...updateCommentReducer)
  .immerCase(...deleteCommentReducer)
  .immerCase(...updateUnreadCommentsReducer)
  .immerCase(...removeManyByDiagramIDsReducer)
  .build();

export default threadReducer;
