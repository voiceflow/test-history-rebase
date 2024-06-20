import { Utils } from '@voiceflow/common';
import { ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, normalize, removeMany } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { INITIAL_STATE, type ReferenceState } from './reference.state';
import {
  arrayWithoutValues,
  buildReferenceCache,
  cleanupGlobalTriggerNodeIDsByIntentIDMapByDiagramIDMap,
  mergeArrays,
  mergeArraysMaps,
  mergeNestedArraysMaps,
  mergeSimpleMaps,
  omitMapKeys,
} from './reference.util';

export const referenceReducer = reducerWithInitialState<ReferenceState>(INITIAL_STATE)
  .case(Actions.Reference.Replace, (_, { data }) => {
    const normalizedReferences = normalize(data.references);
    const normalizedReferenceResources = normalize(data.referenceResources);

    return {
      ...buildReferenceCache({
        references: data.references,
        resourceMap: normalizedReferenceResources.byKey,
        referenceMap: normalizedReferences.byKey,
        referenceResources: data.referenceResources,
      }),
      resources: normalizedReferenceResources,
      references: normalizedReferences,
    };
  })
  .case(Actions.Reference.AddMany, (state, { data }) => {
    if (!data.references.length && !data.referenceResources.length) return state;

    const normalizedReferences = appendMany(state.references, data.references);
    const normalizedReferenceResources = appendMany(state.resources, data.referenceResources);

    const cache = buildReferenceCache({
      references: data.references,
      resourceMap: normalizedReferenceResources.byKey,
      referenceMap: normalizedReferences.byKey,
      referenceResources: data.referenceResources,
    });

    return {
      resources: normalizedReferenceResources,
      references: normalizedReferences,
      blockNodeResourceIDs: mergeArrays(state.blockNodeResourceIDs, cache.blockNodeResourceIDs),
      intentIDResourceIDMap: mergeSimpleMaps(state.intentIDResourceIDMap, cache.intentIDResourceIDMap),
      messageIDResourceIDMap: mergeSimpleMaps(state.messageIDResourceIDMap, cache.messageIDResourceIDMap),
      diagramIDResourceIDMap: mergeSimpleMaps(state.diagramIDResourceIDMap, cache.diagramIDResourceIDMap),
      triggerNodeResourceIDs: mergeArrays(state.triggerNodeResourceIDs, cache.triggerNodeResourceIDs),
      functionIDResourceIDMap: mergeSimpleMaps(state.functionIDResourceIDMap, cache.functionIDResourceIDMap),
      resourceIDsByDiagramIDMap: mergeArraysMaps(state.resourceIDsByDiagramIDMap, cache.resourceIDsByDiagramIDMap),
      resourceIDsByRefererIDMap: mergeArraysMaps(state.resourceIDsByRefererIDMap, cache.resourceIDsByRefererIDMap),
      refererIDsByResourceIDMap: mergeArraysMaps(state.refererIDsByResourceIDMap, cache.refererIDsByResourceIDMap),
      referenceIDsByResourceIDMap: mergeArraysMaps(
        state.referenceIDsByResourceIDMap,
        cache.referenceIDsByResourceIDMap
      ),
      referenceIDsByReferrerIDMap: mergeArraysMaps(
        state.referenceIDsByReferrerIDMap,
        cache.referenceIDsByReferrerIDMap
      ),
      globalTriggerNodeIDsByIntentIDMapByDiagramIDMap: mergeNestedArraysMaps(
        state.globalTriggerNodeIDsByIntentIDMapByDiagramIDMap,
        cache.globalTriggerNodeIDsByIntentIDMapByDiagramIDMap
      ),
    };
  })
  .case(Actions.Reference.DeleteMany, (state, { data }) => {
    if (!data.references.length && !data.referenceResources.length) return state;

    const intentIDs: string[] = [];
    const diagramIDs: string[] = [];
    const messageIDs: string[] = [];
    const functionIDs: string[] = [];
    const resourceIDs: string[] = [];
    const triggerNodeResources: ReferenceResource[] = [];

    for (const resource of data.referenceResources) {
      resourceIDs.push(resource.id);

      switch (resource.type) {
        case ReferenceResourceType.INTENT:
          intentIDs.push(resource.resourceID);
          break;

        case ReferenceResourceType.MESSAGE:
          messageIDs.push(resource.resourceID);
          break;

        case ReferenceResourceType.DIAGRAM:
          diagramIDs.push(resource.resourceID);
          break;

        case ReferenceResourceType.FUNCTION:
          functionIDs.push(resource.resourceID);
          break;

        case ReferenceResourceType.NODE:
          if (resource.metadata && Realtime.Utils.typeGuards.isTriggersNodeType(resource.metadata.nodeType)) {
            triggerNodeResources.push(resource);
          }

          break;

        default:
          break;
      }
    }

    const referenceIDs = Utils.array.unique([
      ...data.references.map((reference) => reference.id),
      ...resourceIDs.flatMap((resourceID) => state.referenceIDsByResourceIDMap[resourceID] ?? []),
      ...resourceIDs.flatMap((resourceID) => state.referenceIDsByReferrerIDMap[resourceID] ?? []),
    ]);

    return {
      resources: removeMany(state.resources, resourceIDs),
      references: removeMany(state.references, referenceIDs),
      blockNodeResourceIDs: arrayWithoutValues(state.blockNodeResourceIDs, resourceIDs),
      intentIDResourceIDMap: omitMapKeys(state.intentIDResourceIDMap, intentIDs),
      messageIDResourceIDMap: omitMapKeys(state.messageIDResourceIDMap, messageIDs),
      triggerNodeResourceIDs: arrayWithoutValues(state.triggerNodeResourceIDs, resourceIDs),
      diagramIDResourceIDMap: omitMapKeys(state.diagramIDResourceIDMap, diagramIDs),
      functionIDResourceIDMap: omitMapKeys(state.functionIDResourceIDMap, functionIDs),
      resourceIDsByDiagramIDMap: data.referenceResources.reduce((acc, resource) => {
        if (!resource.diagramID || !acc[resource.diagramID]?.length) return acc;

        return { ...acc, [resource.diagramID]: Utils.array.withoutValue(acc[resource.diagramID] ?? [], resource.id) };
      }, state.resourceIDsByDiagramIDMap),
      resourceIDsByRefererIDMap: omitMapKeys(state.resourceIDsByRefererIDMap, resourceIDs),
      refererIDsByResourceIDMap: omitMapKeys(state.refererIDsByResourceIDMap, resourceIDs),
      referenceIDsByResourceIDMap: omitMapKeys(state.referenceIDsByResourceIDMap, resourceIDs),
      referenceIDsByReferrerIDMap: omitMapKeys(state.referenceIDsByReferrerIDMap, resourceIDs),
      globalTriggerNodeIDsByIntentIDMapByDiagramIDMap: cleanupGlobalTriggerNodeIDsByIntentIDMapByDiagramIDMap({
        intentIDs,
        diagramIDs,
        stateValue: state.globalTriggerNodeIDsByIntentIDMapByDiagramIDMap,
        triggerNodeResources,
      }),
    };
  });
