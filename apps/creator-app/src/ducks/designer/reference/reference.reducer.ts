import { Utils } from '@voiceflow/common';
import type { ReferenceResource } from '@voiceflow/dtos';
import { ReferenceResourceType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';
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
    const resourceMap = Utils.array.createMap(data.referenceResources, (resource) => resource.id);
    const referenceMap = Utils.array.createMap(data.references, (reference) => reference.id);

    return {
      ...buildReferenceCache({
        references: data.references,
        resourceMap,
        referenceMap,
        referenceResources: data.referenceResources,
      }),
      resourceMap,
      referenceMap,
    };
  })
  .case(Actions.Reference.AddMany, (state, { data }) => {
    if (!data.references.length && !data.referenceResources.length) return state;

    const resourceMap = {
      ...state.resourceMap,
      ...Utils.array.createMap(data.referenceResources, (resource) => resource.id),
    };

    const referenceMap = {
      ...state.referenceMap,
      ...Utils.array.createMap(data.references, (resource) => resource.id),
    };

    const cache = buildReferenceCache({
      references: data.references,
      resourceMap,
      referenceMap,
      referenceResources: data.referenceResources,
    });

    return {
      resourceMap,
      referenceMap,

      // caches
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
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .case(Actions.Reference.DeleteMany, (state, { data }) => {
    if (!data.references.length && !data.referenceResources.length) return state;

    const newResourceMap = { ...state.resourceMap };
    const newReferenceMap = { ...state.referenceMap };
    const newRefererIDsByResourceIDMap = { ...state.refererIDsByResourceIDMap };
    const newResourceIDsByRefererIDMap = { ...state.resourceIDsByRefererIDMap };
    const newReferenceIDsByResourceIDMap = { ...state.referenceIDsByResourceIDMap };
    const newReferenceIDsByReferrerIDMap = { ...state.referenceIDsByReferrerIDMap };

    const intentIDs: string[] = [];
    const diagramIDs: string[] = [];
    const messageIDs: string[] = [];
    const functionIDs: string[] = [];
    const resourceIDs: string[] = [];
    const triggerNodeResources: ReferenceResource[] = [];

    for (const resource of data.referenceResources) {
      delete newResourceMap[resource.id];
      delete newRefererIDsByResourceIDMap[resource.id];
      delete newResourceIDsByRefererIDMap[resource.id];
      delete newReferenceIDsByResourceIDMap[resource.id];
      delete newReferenceIDsByReferrerIDMap[resource.id];

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

    for (const id of referenceIDs) {
      delete newReferenceMap[id];

      const reference = state.referenceMap[id];

      if (!reference) continue;

      const { resourceID, referrerResourceID } = reference;

      if (newRefererIDsByResourceIDMap[resourceID]?.length) {
        newRefererIDsByResourceIDMap[resourceID] = arrayWithoutValues(newRefererIDsByResourceIDMap[resourceID]!, [
          referrerResourceID,
        ]);
      }

      if (newResourceIDsByRefererIDMap[referrerResourceID]?.length) {
        newResourceIDsByRefererIDMap[referrerResourceID] = arrayWithoutValues(
          newResourceIDsByRefererIDMap[referrerResourceID]!,
          [resourceID]
        );
      }

      if (newReferenceIDsByResourceIDMap[resourceID]?.length) {
        newReferenceIDsByResourceIDMap[resourceID] = arrayWithoutValues(newReferenceIDsByResourceIDMap[resourceID]!, [
          id,
        ]);
      }

      if (newReferenceIDsByReferrerIDMap[referrerResourceID]?.length) {
        newReferenceIDsByReferrerIDMap[referrerResourceID] = arrayWithoutValues(
          newReferenceIDsByReferrerIDMap[referrerResourceID]!,
          [id]
        );
      }
    }

    return {
      resourceMap: newResourceMap,
      referenceMap: newReferenceMap,
      blockNodeResourceIDs: arrayWithoutValues(state.blockNodeResourceIDs, resourceIDs),
      intentIDResourceIDMap: omitMapKeys(state.intentIDResourceIDMap, intentIDs),
      messageIDResourceIDMap: omitMapKeys(state.messageIDResourceIDMap, messageIDs),
      triggerNodeResourceIDs: arrayWithoutValues(state.triggerNodeResourceIDs, resourceIDs),
      diagramIDResourceIDMap: omitMapKeys(state.diagramIDResourceIDMap, diagramIDs),
      functionIDResourceIDMap: omitMapKeys(state.functionIDResourceIDMap, functionIDs),
      resourceIDsByDiagramIDMap: data.referenceResources.reduce(
        (acc, resource) => {
          if (!resource.diagramID || !acc[resource.diagramID]?.length) return acc;

          return { ...acc, [resource.diagramID]: Utils.array.withoutValue(acc[resource.diagramID] ?? [], resource.id) };
        },
        omitMapKeys(state.resourceIDsByDiagramIDMap, diagramIDs)
      ),
      resourceIDsByRefererIDMap: newResourceIDsByRefererIDMap,
      refererIDsByResourceIDMap: newRefererIDsByResourceIDMap,
      referenceIDsByResourceIDMap: newReferenceIDsByResourceIDMap,
      referenceIDsByReferrerIDMap: newReferenceIDsByReferrerIDMap,
      globalTriggerNodeIDsByIntentIDMapByDiagramIDMap: cleanupGlobalTriggerNodeIDsByIntentIDMapByDiagramIDMap({
        intentIDs,
        diagramIDs,
        stateValue: state.globalTriggerNodeIDsByIntentIDMapByDiagramIDMap,
        triggerNodeResources,
      }),
    };
  });
