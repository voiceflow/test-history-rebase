import { BaseNode } from '@voiceflow/base-types';
import { EmptyObject } from '@voiceflow/common';
import { NodeType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
import { useMemo } from 'react';
import { match } from 'ts-pattern';

import { Designer, Diagram } from '@/ducks';
import { useFeature, useSelector } from '@/hooks';
import type { ManagerGetter } from '@/pages/Canvas/contexts';
import { getCustomAPIActionLabel } from '@/utils/customApi';
import { transformVariablesToReadable } from '@/utils/slot';

interface ItemConfig {
  icon?: SvgIconTypes.Icon;
  isEmpty: boolean;
  placeholder: string;
  defaultName: string;
}

export const useItemConfig = (getManager: ManagerGetter, data: Realtime.NodeData<EmptyObject>): ItemConfig => {
  const manager = getManager(data.type);
  const referenceSystem = useFeature(Realtime.FeatureFlag.REFERENCE_SYSTEM);

  const intentMap = useSelector(Designer.Intent.selectors.mapWithFormattedBuiltInName);
  const diagramMap = useSelector(Diagram.diagramMapSelector);
  const sharedNodes = useSelector(Diagram.sharedNodesSelector);
  const entitiesAndVariables = useSelector(Diagram.active.allSlotsAndVariablesNormalizedSelector);
  const blockNodeResourceByNodeIDMapByDiagramIDMap = useSelector(
    Designer.Reference.selectors.blockNodeResourceByNodeIDMapByDiagramIDMap
  );

  return useMemo(
    () =>
      match(data)
        .when(Realtime.Utils.typeGuards.isGoToIntentNodeData, ({ intent: intentID }) => {
          const goToIntent = intentID ? intentMap[intentID] : null;

          return {
            icon: manager.icon,
            isEmpty: !goToIntent,
            defaultName: goToIntent ? `Go to '${goToIntent.name}' intent` : '',
            placeholder: 'Select go-to intent',
          };
        })
        .when(Realtime.Utils.typeGuards.isGoToNodeNodeData, ({ goToNodeID, diagramID }) => {
          const sharedNode = diagramID && goToNodeID ? sharedNodes[diagramID]?.[goToNodeID] ?? null : null;
          const referenceNode =
            diagramID && goToNodeID
              ? blockNodeResourceByNodeIDMapByDiagramIDMap[diagramID]?.[goToNodeID] ?? null
              : null;

          const isEmpty = referenceSystem.isEnabled ? !referenceNode : !sharedNode;
          const sharedNodeName =
            (sharedNode?.type === Realtime.BlockType.COMBINED && sharedNode.name) ||
            (sharedNode?.type === Realtime.BlockType.START && 'Start');
          const referencedNodeName =
            referenceNode?.metadata.nodeType === NodeType.START ? 'Start' : referenceNode?.metadata.name;
          const name = referenceSystem.isEnabled ? referencedNodeName : sharedNodeName;

          return {
            icon: manager.icon,
            isEmpty,
            defaultName: name ? `Go to '${name}' block` : 'Go to block',
            placeholder: 'Select go-to block',
          };
        })
        .when(Realtime.Utils.typeGuards.isURLNodeData, ({ url }) => ({
          icon: manager.icon,
          isEmpty: !url,
          defaultName: 'Open URL',
          placeholder: 'Add URL',
        }))
        .when(Realtime.Utils.typeGuards.isExitNodeData, () => ({
          icon: manager.icon,
          isEmpty: false,
          defaultName: 'End conversation',
          placeholder: 'End conversation',
        }))
        .when(Realtime.Utils.typeGuards.isSetV2NodeData, ({ sets }) => {
          const nonEmptySet = sets.find((set) => set.variable && entitiesAndVariables.byKey[set.variable]);

          return {
            icon: manager.icon,
            isEmpty: !nonEmptySet,
            defaultName: nonEmptySet
              ? `Set {${entitiesAndVariables.byKey[nonEmptySet.variable!].name}} to ${transformVariablesToReadable(
                  String(nonEmptySet.expression) || "''",
                  entitiesAndVariables.byKey
                )}`
              : '',
            placeholder: 'Select variable',
          };
        })
        .when(Realtime.Utils.typeGuards.isCodeNodeData, ({ code }) => ({
          icon: manager.icon,
          isEmpty: !code,
          defaultName: 'Javascript',
          placeholder: 'Add javascript',
        }))
        .when(Realtime.Utils.typeGuards.isComponentNodeData, ({ diagramID }) => {
          const diagram = diagramID ? diagramMap[diagramID] : null;

          return {
            icon: manager.icon,
            isEmpty: !diagram,
            defaultName: diagram?.name ?? 'Component',
            placeholder: 'Select component',
          };
        })
        .when(Realtime.Utils.typeGuards.isIntegrationNodeData, ({ selectedAction, selectedIntegration }) => {
          if (selectedIntegration !== BaseNode.Utils.IntegrationType.CUSTOM_API) {
            return {
              icon: manager.icon,
              isEmpty: false,
              defaultName: selectedAction ?? '',
              placeholder: 'Add integration',
            };
          }

          const { url } = data as Realtime.NodeData<Realtime.NodeData.CustomApi>;

          return {
            icon: manager.getIcon?.(data as any) ?? manager.icon,
            isEmpty: !url,
            defaultName: `${getCustomAPIActionLabel(selectedAction)} request`,
            placeholder: 'Add request',
          };
        })
        .otherwise(() => ({
          icon: manager.icon,
          isEmpty: false,
          defaultName: (manager.factory?.()?.data.name as string) ?? '',
          placeholder: manager.label ?? 'Unknown action',
        })),
    [
      data,
      manager,
      intentMap,
      diagramMap,
      sharedNodes,
      entitiesAndVariables,
      blockNodeResourceByNodeIDMapByDiagramIDMap,
      referenceSystem.isEnabled,
    ]
  );
};
