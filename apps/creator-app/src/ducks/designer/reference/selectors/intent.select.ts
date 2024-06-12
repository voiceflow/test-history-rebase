import { createSelector } from 'reselect';

import { getAllReferenceIDsByReferrerID, getAllReferencesByIDs, getOneResourceByID } from './root.select';
import { triggerNodeResources } from './trigger.select';

export const globalIntentNodeIDsByIntentIDMapByDiagramIDMap = createSelector(
  [triggerNodeResources, getAllReferenceIDsByReferrerID, getAllReferencesByIDs, getOneResourceByID],
  (triggerNodeResources, getAllReferenceIDsByReferrerID, getAllReferencesByIDs, getOneResourceByID) =>
    triggerNodeResources.reduce<Partial<Record<string, Partial<Record<string, string[]>>>>>((acc, resource) => {
      const { diagramID } = resource;

      if (!diagramID) return acc;

      const referenceIDs = getAllReferenceIDsByReferrerID({ referrerID: resource.id });
      const references = getAllReferencesByIDs({ ids: referenceIDs });

      const globalIntentIDs: string[] = [];

      for (const reference of references) {
        if (!reference.metadata || !('isGlobal' in reference.metadata) || !reference.metadata.isGlobal) {
          continue;
        }

        const intentResource = getOneResourceByID({ id: reference.resourceID });

        if (!intentResource) {
          continue;
        }

        globalIntentIDs.push(intentResource.resourceID);
      }

      acc[diagramID] ??= {};

      globalIntentIDs.forEach((globalIntentID) => {
        acc[diagramID]![globalIntentID] ??= [];
        acc[diagramID]![globalIntentID]!.push(resource.resourceID);
      });

      return acc;
    }, {})
);
