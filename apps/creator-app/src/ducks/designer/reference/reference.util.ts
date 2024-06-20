import { Utils } from '@voiceflow/common';
import { NodeType, Reference, ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

export const mergeArrays = <T>(stateValue: T[], addValue: T[]) => {
  if (addValue.length === 0) return stateValue;

  return [...stateValue, ...addValue];
};

export const mergeSimpleMaps = <T>(stateValue: Partial<Record<string, T>>, addValue: Partial<Record<string, T>>) => {
  if (Object.keys(addValue).length === 0) return stateValue;

  return { ...stateValue, ...addValue };
};

export const mergeArraysMaps = <T>(
  stateValue: Partial<Record<string, T[]>>,
  addValue: Partial<Record<string, T[]>>
) => {
  const addValueEntries = Object.entries(addValue);

  if (addValueEntries.length === 0) return stateValue;

  const nextStateValue = { ...stateValue };

  for (const [addValueKey, addValueValue] of addValueEntries) {
    if (!addValueValue) continue;

    nextStateValue[addValueKey] = [...(nextStateValue[addValueKey] ?? []), ...addValueValue];
  }

  return nextStateValue;
};

export const mergeNestedSimpleMaps = <T>(
  stateValue: Partial<Record<string, Partial<Record<string, T>>>>,
  addValue: Partial<Record<string, Partial<Record<string, T>>>>
) => {
  const addValueEntries = Object.entries(addValue);

  if (addValueEntries.length === 0) return stateValue;

  const nextStateValue = { ...stateValue };

  for (const [addValueKey, addValueValue] of addValueEntries) {
    if (!addValueValue) continue;

    nextStateValue[addValueKey] = mergeSimpleMaps(nextStateValue[addValueKey] ?? {}, addValueValue);
  }

  return nextStateValue;
};

export const mergeNestedArraysMaps = <T>(
  stateValue: Partial<Record<string, Partial<Record<string, T[]>>>>,
  addValue: Partial<Record<string, Partial<Record<string, T[]>>>>
) => {
  const addValueEntries = Object.entries(addValue);

  if (addValueEntries.length === 0) return stateValue;

  const nextStateValue = { ...stateValue };

  for (const [addValueKey, addValueValue] of addValueEntries) {
    if (!addValueValue) continue;

    nextStateValue[addValueKey] = mergeArraysMaps(nextStateValue[addValueKey] ?? {}, addValueValue);
  }

  return nextStateValue;
};

export const omitMapKeys = <T>(stateValue: Partial<Record<string, T>>, keys: string[]): Partial<Record<string, T>> => {
  if (!keys.length) return stateValue;

  return Utils.object.omit(stateValue, keys);
};

export const arrayWithoutValues = <T>(array: T[], values: T[]) => {
  if (!values.length) return array;

  if (values.length === 1) {
    return Utils.array.withoutValue(array, values[0]);
  }

  return Utils.array.withoutValues(array, values);
};

export const buildReferenceCache = ({
  references,
  resourceMap,
  referenceMap,
  referenceResources,
}: {
  references: Reference[];
  resourceMap: Partial<Record<string, ReferenceResource>>;
  referenceMap: Partial<Record<string, Reference>>;
  referenceResources: ReferenceResource[];
}) => {
  const blockNodeResourceIDs: string[] = [];
  const intentIDResourceIDMap: Partial<Record<string, string>> = {};
  const messageIDResourceIDMap: Partial<Record<string, string>> = {};
  const diagramIDResourceIDMap: Partial<Record<string, string>> = {};
  const triggerNodeResourceIDs: string[] = [];
  const functionIDResourceIDMap: Partial<Record<string, string>> = {};
  const resourceIDsByDiagramIDMap: Partial<Record<string, string[]>> = {};
  const refererIDsByResourceIDMap: Partial<Record<string, string[]>> = {};
  const resourceIDsByRefererIDMap: Partial<Record<string, string[]>> = {};
  const referenceIDsByResourceIDMap: Partial<Record<string, string[]>> = {};
  const referenceIDsByReferrerIDMap: Partial<Record<string, string[]>> = {};
  const resourceIDByTriggerNodeIDMapByDiagramIDMap: Partial<Record<string, Partial<Record<string, string>>>> = {};
  const globalTriggerNodeIDsByIntentIDMapByDiagramIDMap: Partial<Record<string, Partial<Record<string, string[]>>>> =
    {};

  const buildTriggersCache = ({ id, diagramID, resourceID }: ReferenceResource) => {
    if (!diagramID) return;

    resourceIDByTriggerNodeIDMapByDiagramIDMap[diagramID] ??= {};
    globalTriggerNodeIDsByIntentIDMapByDiagramIDMap[diagramID] ??= {};

    resourceIDByTriggerNodeIDMapByDiagramIDMap[diagramID]![resourceID] = id;

    const referenceIDs = referenceIDsByReferrerIDMap[id] ?? [];
    const references = referenceIDs.map((referenceID) => referenceMap[referenceID]);

    for (const reference of references) {
      if (!reference?.metadata || !('isGlobal' in reference.metadata) || !reference.metadata.isGlobal) {
        continue;
      }

      const intentResource = resourceMap[reference.resourceID];

      if (!intentResource || intentResource.type !== ReferenceResourceType.INTENT) {
        continue;
      }

      globalTriggerNodeIDsByIntentIDMapByDiagramIDMap[diagramID]![intentResource.resourceID] ??= [];
      globalTriggerNodeIDsByIntentIDMapByDiagramIDMap[diagramID]![intentResource.resourceID]!.push(resourceID);
    }
  };

  for (const reference of references) {
    resourceIDsByRefererIDMap[reference.referrerResourceID] ??= [];
    resourceIDsByRefererIDMap[reference.referrerResourceID]!.push(reference.resourceID);

    refererIDsByResourceIDMap[reference.resourceID] ??= [];
    refererIDsByResourceIDMap[reference.resourceID]!.push(reference.referrerResourceID);

    referenceIDsByResourceIDMap[reference.resourceID] ??= [];
    referenceIDsByResourceIDMap[reference.resourceID]!.push(reference.id);

    referenceIDsByReferrerIDMap[reference.referrerResourceID] ??= [];
    referenceIDsByReferrerIDMap[reference.referrerResourceID]!.push(reference.id);
  }

  for (const resource of referenceResources) {
    if (resource.diagramID) {
      resourceIDsByDiagramIDMap[resource.diagramID] ??= [];
      resourceIDsByDiagramIDMap[resource.diagramID]!.push(resource.id);
    }

    switch (resource.type) {
      case ReferenceResourceType.INTENT:
        intentIDResourceIDMap[resource.resourceID] = resource.id;
        break;

      case ReferenceResourceType.MESSAGE:
        messageIDResourceIDMap[resource.resourceID] = resource.id;
        break;

      case ReferenceResourceType.FUNCTION:
        functionIDResourceIDMap[resource.resourceID] = resource.id;
        break;

      case ReferenceResourceType.DIAGRAM:
        diagramIDResourceIDMap[resource.resourceID] = resource.id;
        break;

      case ReferenceResourceType.NODE:
        if (resource.metadata?.nodeType === NodeType.BLOCK || resource.metadata?.nodeType === NodeType.START) {
          blockNodeResourceIDs.push(resource.id);
        }

        if (resource.metadata && Realtime.Utils.typeGuards.isTriggersNodeType(resource.metadata.nodeType)) {
          triggerNodeResourceIDs.push(resource.id);

          buildTriggersCache(resource);
        }
        break;

      default:
        break;
    }
  }

  return {
    blockNodeResourceIDs,
    intentIDResourceIDMap,
    triggerNodeResourceIDs,
    messageIDResourceIDMap,
    diagramIDResourceIDMap,
    functionIDResourceIDMap,
    resourceIDsByDiagramIDMap,
    refererIDsByResourceIDMap,
    resourceIDsByRefererIDMap,
    referenceIDsByResourceIDMap,
    referenceIDsByReferrerIDMap,
    resourceIDByTriggerNodeIDMapByDiagramIDMap,
    globalTriggerNodeIDsByIntentIDMapByDiagramIDMap,
  };
};

export const cleanupGlobalTriggerNodeIDsByIntentIDMapByDiagramIDMap = ({
  intentIDs,
  diagramIDs,
  stateValue,
  triggerNodeResources,
}: {
  intentIDs: string[];
  diagramIDs: string[];
  stateValue: Partial<Record<string, Partial<Record<string, string[]>>>>;
  triggerNodeResources: ReferenceResource[];
}) => {
  let nextStateValue = omitMapKeys(stateValue, diagramIDs);

  if (intentIDs.length) {
    nextStateValue = Object.fromEntries(
      Object.entries(nextStateValue).map(([diagramID, intentIDResourceIDMap]) => [
        diagramID,
        intentIDResourceIDMap ? omitMapKeys(intentIDResourceIDMap, intentIDs) : intentIDResourceIDMap,
      ])
    );
  }

  if (triggerNodeResources.length) {
    nextStateValue = triggerNodeResources.reduce((acc, resource) => {
      if (!resource.diagramID) return acc;

      const intentIDResourceIDMap = acc[resource.diagramID];

      if (!intentIDResourceIDMap) return acc;

      return {
        ...acc,
        [resource.diagramID]: Object.fromEntries(
          Object.entries(intentIDResourceIDMap).map(([intentID, triggerNodeResourceIDs]) => [
            intentID,
            triggerNodeResourceIDs ? arrayWithoutValues(triggerNodeResourceIDs, [resource.id]) : triggerNodeResourceIDs,
          ])
        ),
      };
    }, nextStateValue);
  }

  return nextStateValue;
};
