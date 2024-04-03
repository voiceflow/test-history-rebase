import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { EmptyObject, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createDividerMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Domain from '@/ducks/domain';
import { useFeature, useSelector, useTrackingEvents } from '@/hooks';
import { EngineContext, LinkStepMenuContext } from '@/pages/Canvas/contexts';

interface ActionsOptions {
  goToActions: (data: { sourcePortID: string; sourceNodeID: string; actionNodeID: string }) => void;
  sourcePortID: string | null;
}

interface OnAddOptions extends ActionsOptions {
  sourceNode: Realtime.Node | null;
  targetNode: Realtime.Node | null;
  targetNodeSteps: Realtime.NodeData<EmptyObject>[];
  hasNavigationStep: boolean;
  targetNodeIsActions: boolean;
}

const useOnAddAction = ({
  sourceNode,
  targetNode,
  goToActions,
  sourcePortID,
  targetNodeSteps,
  hasNavigationStep,
  targetNodeIsActions,
}: OnAddOptions) => {
  const engine = React.useContext(EngineContext)!;
  const linkStepMenu = React.useContext(LinkStepMenuContext)!;
  const [trackingEvents] = useTrackingEvents();

  const [lastCreatedStepID, setLastCreatedStepID] = React.useState<string | null>(null);

  const getNextActionIndex = (type: BlockType) => {
    if (!targetNodeIsActions) return 0;

    let index = targetNodeSteps.length;

    if (targetNodeSteps.some((step) => Realtime.Utils.typeGuards.isNavigationBlockType(step.type))) {
      if (Realtime.Utils.typeGuards.isNavigationBlockType(type)) {
        throw new Error("The actions can't have multiple navigation steps");
      }

      // navigation steps should always be last
      index -= 1;
    } else if (Realtime.Utils.typeGuards.isURLBlockType(type)) {
      if (targetNodeSteps.some((step) => Realtime.Utils.typeGuards.isURLBlockType(step.type))) {
        throw new Error("The actions can't have multiple url steps");
      }

      // url action should always be first
      index = 0;
    }

    return index;
  };

  const beforeAdd = async (index: number) => {
    if (!sourcePortID) return;

    // remove the link before creating an action node
    if (targetNode && !targetNodeIsActions) {
      const linkIDs = engine.getLinkIDsByPortID(sourcePortID);

      if (linkIDs.length) {
        await engine.link.removeMany(linkIDs).catch(Utils.functional.noop);
      }

      // remove the last action link before adding a new one
    } else if (targetNodeIsActions && targetNodeSteps.length && !hasNavigationStep && index) {
      const linkIDs = engine.getLinkIDsByNodeID(targetNodeSteps[targetNodeSteps.length - 1].nodeID);

      if (linkIDs.length) {
        await engine.link.removeMany(linkIDs);
      }
    }
  };

  const afterAdd = async ({ type, actionsNodeID }: { type: BlockType; actionsNodeID: string }) => {
    if (!sourcePortID) return;

    const sourceNode = engine.select(CreatorV2.nodeByPortIDSelector, { id: sourcePortID });
    const actionsNodePorts = engine.select(CreatorV2.portsByNodeIDSelector, { id: actionsNodeID });

    if (sourceNode) {
      trackingEvents.trackActionAdded({ nodeType: sourceNode.type, actionType: type });
    }

    // add the link to action node only if it is not linked yet
    if (!targetNodeIsActions && actionsNodePorts.in[0]) {
      await engine.link.add(sourcePortID, actionsNodePorts.in[0]);
    }

    engine.linkCreation.abort();
    linkStepMenu.onHide();
  };

  const onAdd = async <K extends BlockType>(type: K, factoryData?: Partial<Realtime.NodeData<Realtime.NodeDataMap[K]>>) => {
    if (!sourcePortID) return;

    const index = getNextActionIndex(type);

    await beforeAdd(index);

    const nodeID = Utils.id.objectID();

    setLastCreatedStepID(nodeID);

    const { actionsNodeID } = await engine.node.addActions(
      type,
      index,
      targetNodeIsActions ? targetNode?.id ?? null : null,
      { ...factoryData } as Partial<Realtime.NodeData<Realtime.NodeDataMap[K]>>,
      nodeID
    );

    await afterAdd({ type, actionsNodeID });

    if (sourceNode && type !== BlockType.EXIT) {
      goToActions({ sourcePortID, sourceNodeID: sourceNode.id, actionNodeID: nodeID });
    }
  };

  return {
    onAdd,
    engine,
    lastCreatedStepID,
  };
};

const PORTS_WITHOUT_URL = new Set<string>([BaseModels.PortType.NO_MATCH, BaseModels.PortType.NO_REPLY]);

const useSourceNodeAndPort = (portID: string | null) => {
  let sourcePort = useSelector(CreatorV2.portByIDSelector, { id: portID });
  let sourceNode = useSelector(CreatorV2.nodeByPortIDSelector, { id: portID });

  const getNodeByID = useSelector(CreatorV2.getNodeByIDSelector);
  const getPortByID = useSelector(CreatorV2.getPortByIDSelector);
  const parentNode = useSelector(CreatorV2.nodeByIDSelector, { id: sourceNode?.parentNode });
  const parentNodeLinks = useSelector(CreatorV2.linksByNodeIDSelector, { id: parentNode?.id });

  if (parentNode?.type === Realtime.BlockType.ACTIONS) {
    sourcePort = getPortByID({ id: parentNodeLinks[0]?.source.portID });
    sourceNode = getNodeByID({ id: parentNodeLinks[0]?.source.nodeID });
  }

  return {
    sourceNode,
    sourcePort,
  };
};

export const useActionsOptions = ({ goToActions, sourcePortID }: ActionsOptions) => {
  const { sourceNode, sourcePort } = useSourceNodeAndPort(sourcePortID);

  const cmsWorkflows = useFeature(Realtime.FeatureFlag.CMS_WORKFLOWS);

  const targetNode = useSelector(CreatorV2.targetNodeByPortID, { id: sourcePort?.id });
  const domainsCount = useSelector(Domain.domainsCountSelector);
  const targetNodeSteps = useSelector(CreatorV2.stepDataByParentNodeIDSelector, { id: targetNode?.id });

  const hasURLStep = Realtime.Utils.typeGuards.isURLBlockType(targetNodeSteps[0]?.type);
  const canHaveURLStep =
    Realtime.Utils.typeGuards.isButtonsBlockType(sourceNode?.type) ||
    Realtime.Utils.typeGuards.isCarouselBlockType(sourceNode?.type) ||
    Realtime.Utils.typeGuards.isCardV2BlockType(sourceNode?.type);

  const hasNavigationStep = Realtime.Utils.typeGuards.isNavigationBlockType(targetNodeSteps[targetNodeSteps.length - 1]?.type);

  const targetNodeIsActions = targetNode?.type === BlockType.ACTIONS;

  const { onAdd, lastCreatedStepID } = useOnAddAction({
    sourceNode,
    targetNode,
    goToActions,
    sourcePortID: sourcePort?.id ?? null,
    targetNodeSteps,
    hasNavigationStep,
    targetNodeIsActions,
  });

  const withoutURLAction = !canHaveURLStep || hasURLStep || PORTS_WITHOUT_URL.has(sourcePort?.label ?? '');

  return {
    onAdd,
    hasURLStep,
    targetNode,
    targetNodeSteps,
    hasNavigationStep,
    lastCreatedStepID,
    targetNodeIsActions,

    options: [
      hasNavigationStep ? null : { icon: 'goToBlock' as const, label: 'Go to Block', onClick: () => onAdd(BlockType.GO_TO_NODE) },
      hasNavigationStep ? null : { icon: 'intentSmall' as const, label: 'Go to Intent', onClick: () => onAdd(BlockType.GO_TO_INTENT) },
      // TODO: remove when FeatureFlag.CMS_WORKFLOWS is released
      cmsWorkflows.isEnabled || hasNavigationStep || domainsCount <= 1
        ? null
        : { icon: 'goToDomain' as const, label: 'Go to Domain', onClick: () => onAdd(BlockType.GO_TO_DOMAIN) },
      hasNavigationStep ? null : { icon: 'editorExit' as const, label: 'End', onClick: () => onAdd(BlockType.EXIT) },
      hasNavigationStep ? null : createDividerMenuItemOption(),
      { icon: 'setV2' as const, label: 'Set variable', onClick: () => onAdd(BlockType.SETV2) },
      withoutURLAction ? null : { icon: 'editorURL' as const, label: 'Open URL', onClick: () => onAdd(BlockType.URL) },
      {
        icon: 'integrations' as const,
        label: 'API',
        onClick: () => onAdd(BlockType.INTEGRATION, { selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API }),
      },
      { icon: 'systemCode' as const, label: 'Code', onClick: () => onAdd(BlockType.CODE) },
      { icon: 'componentOutline' as const, label: 'Component', onClick: () => onAdd(BlockType.COMPONENT) },
    ],
  };
};
