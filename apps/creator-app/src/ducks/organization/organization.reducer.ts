// const updateImageReducer = createReducer(Realtime.organization.updateImage, (state, { organizationID, image }) => {
//   const organization = Normal.getOne(state, organizationID);

//   if (organization) {
//     organization.image = image;
//   }
// });

// import * as Realtime from '@voiceflow/realtime-sdk';
// import * as Normal from 'normal-store';

// import { createReducer } from './utils';

// const updateNameReducer = createReducer(Realtime.organization.updateName, (state, { organizationID, name }) => {
//   const organization = Normal.getOne(state, organizationID);

//   if (organization) {
//     organization.name = name;
//   }
// });

// export default updateNameReducer;

// import * as Realtime from '@voiceflow/realtime-sdk';

// import { createCRUDReducers } from '@/ducks/utils/crudV2';

// import { createReducer } from './utils';

// const crudReducers = createCRUDReducers(createReducer, Realtime.organization.crud);

// export default crudReducers;

// import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

// import { INITIAL_STATE } from '../constants';
// import crudReducers from './crud';
// import { removeMember } from './member';
// import updateImage from './updateImage';
// import updateName from './updateName';

// const realtimeOrganizationReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
//   .immerCase(...updateName)
//   .immerCase(...updateImage)

//   // members
//   .immerCase(...removeMember)
//   .build();

// export default realtimeOrganizationReducer;

// import { createReducerFactory } from '@/ducks/utils';

// import { OrganizationState } from '../types';

// export const createReducer = createReducerFactory<OrganizationState>();

import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { OrganizationOnlyState } from './organization.state';

const organizationBaseReducer = reducerWithInitialState<OrganizationOnlyState>(createEmpty())
  .case(Actions.Assistant.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Assistant.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Assistant.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Assistant.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Assistant.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Assistant.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const OrganizationReducer = compositeReducer(organizationBaseReducer, {
  // [Awareness.STATE_KEY]: Awareness.reducer,
});
