import { Actions } from '@voiceflow/sdk-logux-designer';
import * as Normal from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { INITIAL_STATE, type ReferenceState } from './reference.state';
import { buildReferenceCache } from './reference.util';

export const referenceReducer = reducerWithInitialState<ReferenceState>(INITIAL_STATE)
  .case(Actions.Reference.Replace, (_, { data }) => ({
    ...buildReferenceCache(data.references, data.referenceResources),
    resources: Normal.normalize(data.referenceResources),
    references: Normal.normalize(data.references),
  }))
  .case(Actions.Reference.AddMany, (state, { data }) => {
    const cache = buildReferenceCache(data.references, data.referenceResources);

    return {
      resources: Normal.appendMany(state.resources, data.referenceResources),
      references: Normal.appendMany(state.references, data.references),
      blockNodeResourceIDs: [...state.blockNodeResourceIDs, ...cache.blockNodeResourceIDs],
      triggerNodeResourceIDs: [...state.triggerNodeResourceIDs, ...cache.triggerNodeResourceIDs],
      resourceIDsByDiagramIDMap: { ...state.resourceIDsByDiagramIDMap, ...cache.resourceIDsByDiagramIDMap },
      resourceIDsByRefererIDMap: { ...state.resourceIDsByRefererIDMap, ...cache.resourceIDsByRefererIDMap },
      refererIDsByResourceIDMap: { ...state.refererIDsByResourceIDMap, ...cache.refererIDsByResourceIDMap },
      referenceIDsByResourceIDMap: { ...state.referenceIDsByResourceIDMap, ...cache.referenceIDsByResourceIDMap },
      referenceIDsByReferrerIDMap: { ...state.referenceIDsByReferrerIDMap, ...cache.referenceIDsByReferrerIDMap },
    };
  });
