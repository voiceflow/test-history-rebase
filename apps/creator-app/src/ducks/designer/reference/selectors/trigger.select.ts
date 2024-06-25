import { Utils } from '@voiceflow/common';
import { NodeType, ReferenceResourceType, TriggerNodeItemType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { getOneByID as getOneIntentByID } from '@/ducks/designer/intent/selectors/crud.select';
import { sharedNodesSelector } from '@/ducks/diagramV2/selectors/base';
import { featureSelectorFactory } from '@/ducks/feature';
import { diagramIDParamSelector, nodeIDParamSelector } from '@/ducks/utils';

import type { ReferenceAnyTriggerNode, ReferenceTriggerNodeResource } from '../reference.interface';
import { getAllResourceIDsByRefererID, getAllResourcesByIDs, resourceMap, triggerNodeResourceIDs } from './root.select';

export const triggerNodeResources = createSelector(
  [resourceMap, triggerNodeResourceIDs],
  (resourceMap, triggerNodeResourceIDs) =>
    triggerNodeResourceIDs
      .map((id) => resourceMap[id])
      .filter(
        (resource): resource is ReferenceTriggerNodeResource =>
          !!resource &&
          resource.type === ReferenceResourceType.NODE &&
          !!resource.metadata &&
          Realtime.Utils.typeGuards.isTriggersNodeType(resource.metadata.nodeType)
      )
);

export const triggerNodeResourceByNodeIDMapByDiagramIDMap = createSelector(
  [triggerNodeResources],
  (triggerNodeResources) =>
    triggerNodeResources.reduce<Partial<Record<string, Partial<Record<string, ReferenceTriggerNodeResource>>>>>(
      (acc, resource) => {
        if (!resource.diagramID) return acc;

        acc[resource.diagramID] ??= {};
        acc[resource.diagramID]![resource.resourceID] = resource;

        return acc;
      },
      {}
    )
);

export const triggerNodeResourceByNodeIDAndDiagramID = createSelector(
  [triggerNodeResourceByNodeIDMapByDiagramIDMap, nodeIDParamSelector, diagramIDParamSelector],
  (triggerNodeResourceByNodeIDMapByDiagramIDMap, nodeID, diagramID) =>
    diagramID && nodeID ? triggerNodeResourceByNodeIDMapByDiagramIDMap[diagramID]?.[nodeID] ?? null : null
);

const legacyTriggersMapByDiagramID = createSelector(
  [sharedNodesSelector, getOneIntentByID],
  (sharedNodes, getOneIntentByID) => {
    const TRIGGER_PLACEHOLDER = 'Add trigger...';
    const EMPTY_INTENT_PLACEHOLDER = 'Empty intent';

    const map: Partial<Record<string, ReferenceAnyTriggerNode[]>> = {};

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
            resourceID: node.nodeID,
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
              resourceID: node.nodeID,
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
            resourceID: node.nodeID,
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
              resourceID: node.nodeID,
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
              resourceID: node.nodeID,
            });
          });
        }
      });
    });

    return map;
  }
);

const newTriggersMapByDiagramID = createSelector(
  [triggerNodeResources, getAllResourcesByIDs, getAllResourceIDsByRefererID, getOneIntentByID],
  (triggerNodeResources, getAllResourcesByIDs, getAllResourceIDsByRefererID, getOneIntentByID) => {
    const TRIGGER_PLACEHOLDER = 'Add trigger...';
    const EMPTY_INTENT_PLACEHOLDER = 'Empty intent';

    const map: Partial<Record<string, ReferenceAnyTriggerNode[]>> = {};

    const addTriggerResources = ({
      nodeID,
      nodeType,
      diagramID,
      referrerID,
    }: {
      nodeID: string;
      nodeType: Realtime.BlockType.INTENT | Realtime.BlockType.TRIGGER | Realtime.BlockType.START;
      diagramID: string;
      referrerID: string;
    }) => {
      let added = false;

      const resources = getAllResourcesByIDs({ ids: getAllResourceIDsByRefererID({ referrerID }) });

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
          resourceID: resource.id,
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
          resourceID: resource.id,
        });

        addTriggerResources({
          nodeID: resource.resourceID,
          nodeType: Realtime.BlockType.START,
          diagramID: resource.diagramID,
          referrerID: resource.id,
        });
      } else if (resource.metadata.nodeType === NodeType.INTENT) {
        addTriggerResources({
          nodeID: resource.resourceID,
          nodeType: Realtime.BlockType.INTENT,
          diagramID: resource.diagramID,
          referrerID: resource.id,
        });
      } else if (resource.metadata.nodeType === NodeType.TRIGGER) {
        const added = addTriggerResources({
          nodeID: resource.resourceID,
          nodeType: Realtime.BlockType.TRIGGER,
          diagramID: resource.diagramID,
          referrerID: resource.id,
        });

        if (!added) {
          map[resource.diagramID]!.push({
            id: Utils.id.cuid.slug(),
            type: Realtime.BlockType.TRIGGER,
            label: TRIGGER_PLACEHOLDER,
            nodeID: resource.resourceID,
            isEmpty: true,
            intentID: null,
            resourceID: resource.id,
          });
        }
      }
    });
    return map;
  }
);

export const triggersMapByDiagramID = featureSelectorFactory(Realtime.FeatureFlag.REFERENCE_SYSTEM)(
  legacyTriggersMapByDiagramID,
  newTriggersMapByDiagramID
);

export const nonEmptyTriggersMapByDiagramID = createSelector([triggersMapByDiagramID], (map) =>
  Object.fromEntries(
    Object.entries(map).map(([diagramID, triggers]) => [diagramID, triggers?.filter((trigger) => !trigger.isEmpty)])
  )
);
