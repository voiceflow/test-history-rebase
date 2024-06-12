import { Actions } from '@voiceflow/sdk-logux-designer';
import { normalize } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { INITIAL_STATE, type ReferenceState } from './reference.state';

export const referenceReducer = reducerWithInitialState<ReferenceState>(INITIAL_STATE).case(
  Actions.Reference.Replace,
  (_, { data }) => {
    const referenceIDsByRefererID: Partial<Record<string, string[]>> = {};
    const refererIDsByReferenceID: Partial<Record<string, string[]>> = {};

    data.references.forEach(({ resourceID, referrerResourceID }) => {
      referenceIDsByRefererID[referrerResourceID] ??= [];
      referenceIDsByRefererID[referrerResourceID]!.push(resourceID);

      refererIDsByReferenceID[resourceID] ??= [];
      refererIDsByReferenceID[resourceID]!.push(referrerResourceID);
    });

    return {
      references: normalize(data.references),
      referenceResources: normalize(data.referenceResources),
      referenceIDsByRefererID,
      refererIDsByReferenceID,
    };
  }
);
