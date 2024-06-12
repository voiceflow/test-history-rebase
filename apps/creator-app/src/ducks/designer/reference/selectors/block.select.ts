import { NodeType, ReferenceResourceType } from '@voiceflow/dtos';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { ReferenceBlockNodeResource } from '../reference.interface';
import { blockNodeResourceIDs, normalizedResources } from './root.select';

export const blockNodeResources = createSelector(
  [normalizedResources, blockNodeResourceIDs],
  (normalizedResources, blockNodeResourceIDs) =>
    blockNodeResourceIDs
      .map((id) => Normal.getOne(normalizedResources, id))
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
