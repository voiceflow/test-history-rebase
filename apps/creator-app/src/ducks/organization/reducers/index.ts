import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import { removeMember } from './member';
import replaceScheduledSubscription from './replaceScheduledSubscription';
import replaceSubscription from './replaceSubscription';
import updateImage from './updateImage';
import updateName from './updateName';

const realtimeOrganizationReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...updateName)
  .immerCase(...updateImage)

  // members
  .immerCase(...removeMember)
  .immerCase(...replaceSubscription)
  .immerCase(...replaceScheduledSubscription)
  .build();

export default realtimeOrganizationReducer;
