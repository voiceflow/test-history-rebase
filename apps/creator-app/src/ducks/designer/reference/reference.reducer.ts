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
      intentIDResourceIDMap: { ...state.intentIDResourceIDMap, ...cache.intentIDResourceIDMap },
      diagramIDResourceIDMap: { ...state.diagramIDResourceIDMap, ...cache.diagramIDResourceIDMap },
      triggerNodeResourceIDs: [...state.triggerNodeResourceIDs, ...cache.triggerNodeResourceIDs],
      functionIDResourceIDMap: { ...state.functionIDResourceIDMap, ...cache.functionIDResourceIDMap },
      resourceIDsByDiagramIDMap: { ...state.resourceIDsByDiagramIDMap, ...cache.resourceIDsByDiagramIDMap },
      resourceIDsByRefererIDMap: { ...state.resourceIDsByRefererIDMap, ...cache.resourceIDsByRefererIDMap },
      refererIDsByResourceIDMap: { ...state.refererIDsByResourceIDMap, ...cache.refererIDsByResourceIDMap },
      referenceIDsByResourceIDMap: { ...state.referenceIDsByResourceIDMap, ...cache.referenceIDsByResourceIDMap },
      referenceIDsByReferrerIDMap: { ...state.referenceIDsByReferrerIDMap, ...cache.referenceIDsByReferrerIDMap },
    };
  })
  .case(Actions.Reference.DeleteMany, (state, { data }) => {
    const intentIDs: string[] = [];
    const diagramIDs: string[] = [];
    const functionIDs: string[] = [];
    const resourceIDs: string[] = [];

    data.referenceResources.forEach((resource) => {
      resourceIDs.push(resource.id);

      switch (resource.type) {
        case ReferenceResourceType.INTENT:
          intentIDs.push(resource.resourceID);
          break;

        case ReferenceResourceType.DIAGRAM:
          diagramIDs.push(resource.resourceID);
          break;

        case ReferenceResourceType.FUNCTION:
          functionIDs.push(resource.resourceID);
          break;

        default:
          break;
      }
    });

    const referenceIDs = Utils.array.unique([
      ...data.references.map((reference) => reference.id),
      ...resourceIDs.flatMap((resourceID) => state.referenceIDsByResourceIDMap[resourceID] ?? []),
      ...resourceIDs.flatMap((resourceID) => state.referenceIDsByReferrerIDMap[resourceID] ?? []),
    ]);

    return {
      resources: removeMany(state.resources, resourceIDs),
      references: removeMany(state.references, referenceIDs),
      blockNodeResourceIDs: Utils.array.withoutValues(state.blockNodeResourceIDs, resourceIDs),
      intentIDResourceIDMap: Utils.object.omit(state.intentIDResourceIDMap, intentIDs),
      diagramIDResourceIDMap: Utils.object.omit(state.diagramIDResourceIDMap, diagramIDs),
      triggerNodeResourceIDs: Utils.array.withoutValues(state.triggerNodeResourceIDs, resourceIDs),
      functionIDResourceIDMap: Utils.object.omit(state.functionIDResourceIDMap, functionIDs),
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
