import { NodeType, ReferenceResourceType } from '@voiceflow/dtos';
import { createSelector } from 'reselect';

import { ReferenceBlockNodeResource } from '../reference.interface';
import { blockNodeResourceIDs, resourceMap } from './root.select';

export const blockNodeResources = createSelector(
  [resourceMap, blockNodeResourceIDs],
  (resourceMap, blockNodeResourceIDs) =>
    blockNodeResourceIDs
      .map((id) => resourceMap[id])
      .filter(
        (resource): resource is ReferenceBlockNodeResource =>
          !!resource &&
          resource.type === ReferenceResourceType.NODE &&
          !!resource.metadata &&
          (resource.metadata.nodeType === NodeType.BLOCK || resource.metadata.nodeType === NodeType.START)
      )
);

export const blockNodeResourceByNodeIDMapByDiagramIDMap = createSelector([blockNodeResources], (blockNodeResources) =>
  blockNodeResources.reduce<Partial<Record<string, Partial<Record<string, ReferenceBlockNodeResource>>>>>(
    (acc, resource) => {
      if (!resource.diagramID) return acc;

      acc[resource.diagramID] ??= {};
      acc[resource.diagramID]![resource.resourceID] = resource;

      return acc;
    },
    {}
  )
);
