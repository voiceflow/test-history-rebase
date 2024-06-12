import { Utils } from '@voiceflow/common';
import { NodeType, ReferenceResourceType, TriggerNodeItemType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { getOneByID as getOneIntentByID } from '@/ducks/designer/intent/selectors/crud.select';
import { sharedNodesSelector } from '@/ducks/diagramV2/selectors/base';
import { isFeatureEnabledSelector } from '@/ducks/feature';
import { createCurriedSelector } from '@/ducks/utils';
import { idsParamSelector } from '@/ducks/utils/crudV2';

import { createDesignerSelector } from '../utils/selector.util';
import {
  ReferenceAnyTriggerNode,
  ReferenceBlockNodeResource,
  ReferenceTriggerNodeResource,
} from './reference.interface';
import { STATE_KEY } from './reference.state';

export const root = createDesignerSelector(STATE_KEY);

export const normalizedResources = createSelector([root], ({ resources }) => resources);

export const normalizedReferences = createSelector([root], ({ references }) => references);

export const blockNodeResourceIDs = createSelector([root], ({ blockNodeResourceIDs }) => blockNodeResourceIDs);

export const triggerNodeResourceIDs = createSelector([root], ({ triggerNodeResourceIDs }) => triggerNodeResourceIDs);

export const resourceIDsByDiagramID = createSelector([root], ({ resourceIDsByDiagramID }) => resourceIDsByDiagramID);

export const refererIDsByResourceID = createSelector([root], ({ refererIDsByResourceID }) => refererIDsByResourceID);

export const resourceIDsByRefererID = createSelector([root], ({ resourceIDsByRefererID }) => resourceIDsByRefererID);

export const resourcesByIDs = createSelector([normalizedResources, idsParamSelector], (normalizedResources, ids) =>
  Normal.getMany(normalizedResources, ids)
);

export const getResourcesByIDs = createCurriedSelector(resourcesByIDs);

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

export const blockResourceByNodeIDMapByDiagramIDMap = createSelector([blockNodeResources], (blockNodeResources) =>
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

export const triggerNodeResources = createSelector(
  [normalizedResources, triggerNodeResourceIDs],
  (normalizedResources, triggerNodeResourceIDs) =>
    triggerNodeResourceIDs
      .map((id) => Normal.getOne(normalizedResources, id))
      .filter(
        (resource): resource is ReferenceTriggerNodeResource =>
          !!resource &&
          resource.type === ReferenceResourceType.NODE &&
          !!resource.metadata &&
          (resource.metadata.nodeType === NodeType.START ||
            resource.metadata.nodeType === NodeType.INTENT ||
            resource.metadata.nodeType === NodeType.TRIGGER)
      )
);

export const triggersMapByDiagramID = createSelector(
  [
    sharedNodesSelector,
    triggerNodeResources,
    getResourcesByIDs,
    resourceIDsByRefererID,
    getOneIntentByID,
    isFeatureEnabledSelector,
  ],
  (
    sharedNodes,
    triggerNodeResources,
    getResourcesByIDs,
    resourceIDsByRefererID,
    getOneIntentByID,
    isFeatureEnabled
    // eslint-disable-next-line max-params
  ) => {
    const TRIGGER_PLACEHOLDER = 'Add trigger...';
    const EMPTY_INTENT_PLACEHOLDER = 'Empty intent';

    const map: Partial<Record<string, ReferenceAnyTriggerNode[]>> = {};

    if (isFeatureEnabled(Realtime.FeatureFlag.REFERENCE_SYSTEM)) {
      const addTriggerResources = ({
        nodeID,
        nodeType,
        diagramID,
        resourceID,
      }: {
        nodeID: string;
        nodeType: Realtime.BlockType.INTENT | Realtime.BlockType.TRIGGER | Realtime.BlockType.START;
        diagramID: string;
        resourceID: string;
      }) => {
        let added = false;

        const resources = getResourcesByIDs({ ids: resourceIDsByRefererID[resourceID] ?? [] });

        resources.forEach((resource) => {
          if (resource.type !== ReferenceResourceType.INTENT) return;

          const intent = getOneIntentByID({ id: resource.resourceID });
          const isEmpty = resource.resourceID && !intent;

          map[diagramID]!.push({
            id: Utils.id.cuid.slug(),
            type: nodeType,
            label: intent?.name ?? (isEmpty ? EMPTY_INTENT_PLACEHOLDER : TRIGGER_PLACEHOLDER),
            nodeID,
            isEmpty: !intent,
            intentID: resource.resourceID,
          });

          added = true;
        });

        return added;
      };

      triggerNodeResources.forEach((resource) => {
        if (!resource.diagramID) return;

        map[resource.diagramID] ??= [];

        if (resource.metadata.nodeType === NodeType.START) {
          map[resource.diagramID]!.unshift({
            id: Utils.id.cuid.slug(),
            type: Realtime.BlockType.START,
            label: resource.metadata.name || 'Start',
            nodeID: resource.resourceID,
            isEmpty: false,
            intentID: null,
          });

          addTriggerResources({
            nodeID: resource.resourceID,
            nodeType: Realtime.BlockType.START,
            diagramID: resource.diagramID,
            resourceID: resource.id,
          });
        } else if (resource.metadata.nodeType === NodeType.INTENT) {
          addTriggerResources({
            nodeID: resource.resourceID,
            nodeType: Realtime.BlockType.INTENT,
            diagramID: resource.diagramID,
            resourceID: resource.id,
          });
        } else if (resource.metadata.nodeType === NodeType.TRIGGER) {
          const added = addTriggerResources({
            nodeID: resource.resourceID,
            nodeType: Realtime.BlockType.TRIGGER,
            diagramID: resource.diagramID,
            resourceID: resource.id,
          });

          if (!added) {
            map[resource.diagramID]!.push({
              id: Utils.id.cuid.slug(),
              type: Realtime.BlockType.TRIGGER,
              label: TRIGGER_PLACEHOLDER,
              nodeID: resource.resourceID,
              isEmpty: true,
              intentID: null,
            });
          }
        }
      });
    } else {
      Object.entries(sharedNodes).forEach(([diagramID, diagramSharedNodes]) => {
        let diagramTriggers = map[diagramID];

        if (!diagramTriggers) {
          diagramTriggers = [];
          map[diagramID] = diagramTriggers;
        }

        Object.values(diagramSharedNodes).forEach((node) => {
          if (!node) return;

          if (node.type === Realtime.BlockType.START) {
            diagramTriggers!.unshift({
              id: Utils.id.cuid.slug(),
              type: node.type,
              label: node.name || 'Start',
              nodeID: node.nodeID,
              isEmpty: false,
              intentID: null,
            });

            node.triggers.forEach((item) => {
              if (item.type !== TriggerNodeItemType.INTENT) return;

              const intent = getOneIntentByID({ id: item.resourceID });
              const isEmpty = item.resourceID && !intent;

              diagramTriggers!.push({
                id: Utils.id.cuid.slug(),
                type: node.type,
                label: intent?.name ?? (isEmpty ? EMPTY_INTENT_PLACEHOLDER : TRIGGER_PLACEHOLDER),
                nodeID: node.nodeID,
                isEmpty: !intent,
                intentID: item.resourceID,
              });
            });
          } else if (node.type === Realtime.BlockType.INTENT) {
            const intent = getOneIntentByID({ id: node.intentID });

            diagramTriggers!.push({
              id: Utils.id.cuid.slug(),
              type: node.type,
              label: intent?.name ?? 'Select intent...',
              nodeID: node.nodeID,
              isEmpty: !intent,
              intentID: node.intentID,
            });
          } else if (node.type === Realtime.BlockType.TRIGGER) {
            if (!node.items.length) {
              diagramTriggers!.push({
                id: Utils.id.cuid.slug(),
                type: node.type,
                label: TRIGGER_PLACEHOLDER,
                nodeID: node.nodeID,
                isEmpty: true,
                intentID: null,
              });

              return;
            }

            node.items.forEach((item) => {
              if (item.type !== TriggerNodeItemType.INTENT) return;

              const intent = getOneIntentByID({ id: item.resourceID });
              const isEmpty = item.resourceID && !intent;

              diagramTriggers!.push({
                id: Utils.id.cuid.slug(),
                type: node.type,
                label: intent?.name ?? (isEmpty ? EMPTY_INTENT_PLACEHOLDER : TRIGGER_PLACEHOLDER),
                nodeID: node.nodeID,
                isEmpty: !intent,
                intentID: item.resourceID,
              });
            });
          }
        });
      });
    }

    return map;
  }
);

export const nonEmptyTriggersMapByDiagramID = createSelector([triggersMapByDiagramID], (map) =>
  Object.fromEntries(
    Object.entries(map).map(([diagramID, triggers]) => [diagramID, triggers?.filter((trigger) => !trigger.isEmpty)])
  )
);
