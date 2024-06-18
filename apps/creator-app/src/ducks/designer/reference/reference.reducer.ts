import { Utils } from '@voiceflow/common';
import { ReferenceResourceType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, normalize, removeMany } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { INITIAL_STATE, type ReferenceState } from './reference.state';
import { buildReferenceCache } from './reference.util';

export const referenceReducer = reducerWithInitialState<ReferenceState>(INITIAL_STATE)
  .case(Actions.Reference.Replace, (_, { data }) => ({
    ...buildReferenceCache(data.references, data.referenceResources),
    resources: normalize(data.referenceResources),
    references: normalize(data.references),
  }))
  .case(Actions.Reference.AddMany, (state, { data }) => {
    const cache = buildReferenceCache(data.references, data.referenceResources);

    return {
      resources: appendMany(state.resources, data.referenceResources),
      references: appendMany(state.references, data.references),
      blockNodeResourceIDs: [...state.blockNodeResourceIDs, ...cache.blockNodeResourceIDs],
      diagramIDResourceIDMap: { ...state.diagramIDResourceIDMap, ...cache.diagramIDResourceIDMap },
      triggerNodeResourceIDs: [...state.triggerNodeResourceIDs, ...cache.triggerNodeResourceIDs],
      resourceIDsByDiagramIDMap: { ...state.resourceIDsByDiagramIDMap, ...cache.resourceIDsByDiagramIDMap },
      resourceIDsByRefererIDMap: { ...state.resourceIDsByRefererIDMap, ...cache.resourceIDsByRefererIDMap },
      refererIDsByResourceIDMap: { ...state.refererIDsByResourceIDMap, ...cache.refererIDsByResourceIDMap },
      referenceIDsByResourceIDMap: { ...state.referenceIDsByResourceIDMap, ...cache.referenceIDsByResourceIDMap },
      referenceIDsByReferrerIDMap: { ...state.referenceIDsByReferrerIDMap, ...cache.referenceIDsByReferrerIDMap },
    };
  })
  .case(Actions.Reference.DeleteMany, (state, { data }) => {
    const resourceIDs = data.referenceResources.map((resource) => resource.id);
    const referenceIDs = Utils.array.unique([
      ...data.references.map((reference) => reference.id),
      ...resourceIDs.flatMap((resourceID) => state.referenceIDsByResourceIDMap[resourceID] ?? []),
      ...resourceIDs.flatMap((resourceID) => state.referenceIDsByReferrerIDMap[resourceID] ?? []),
    ]);

    const diagramIDs = data.referenceResources
      .filter((resource) => resource.type === ReferenceResourceType.DIAGRAM)
      .map((resource) => resource.resourceID);

    return {
      resources: removeMany(state.resources, resourceIDs),
      references: removeMany(state.references, referenceIDs),
      blockNodeResourceIDs: Utils.array.withoutValues(state.blockNodeResourceIDs, resourceIDs),
      diagramIDResourceIDMap: Utils.object.omit(state.diagramIDResourceIDMap, diagramIDs),
      triggerNodeResourceIDs: Utils.array.withoutValues(state.triggerNodeResourceIDs, resourceIDs),
      resourceIDsByDiagramIDMap: data.referenceResources.reduce((acc, resource) => {
        if (!resource.diagramID) return acc;

        return { ...acc, [resource.diagramID]: Utils.array.withoutValue(acc[resource.diagramID] ?? [], resource.id) };
      }, state.resourceIDsByDiagramIDMap),
      resourceIDsByRefererIDMap: Utils.object.omit(state.resourceIDsByRefererIDMap, resourceIDs),
      refererIDsByResourceIDMap: Utils.object.omit(state.refererIDsByResourceIDMap, resourceIDs),
      referenceIDsByResourceIDMap: Utils.object.omit(state.referenceIDsByResourceIDMap, resourceIDs),
      referenceIDsByReferrerIDMap: Utils.object.omit(state.referenceIDsByReferrerIDMap, resourceIDs),
    };
  });
