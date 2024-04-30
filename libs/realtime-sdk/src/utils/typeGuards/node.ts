import { BaseModels, BaseNode } from '@voiceflow/base-types';
import type { AnyRecord } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';

import {
  BlockType,
  CANVAS_CHIPS_NODES,
  CANVAS_TEMPLATE_NODES,
  DIAGRAM_MENU_NODES,
  INTERNAL_NODES,
  MARKUP_AND_COMBINED_NODES,
  MARKUP_MEDIA_NODES,
  MARKUP_NODES,
  NAVIGATION_NODES,
  ROOT_AND_MARKUP_NODES,
  ROOT_NODES,
  SHARED_NODES,
  STARTING_NODES,
} from '@/constants';
import type { DBNodeStart, Markup, NodeData } from '@/models';

import { createTypedTypeGuardCreator, createTypeGuardCreator } from './utils';

export const isStep = <
  Data extends AnyRecord = AnyRecord,
  Ports = BaseModels.NextStepPorts,
  PortsOld = BaseModels.BasePortList,
>(
  node: BaseModels.BaseDiagramNode
): node is BaseModels.BaseStep<Data, Ports, PortsOld> =>
  Array.isArray(node.data.ports) || Utils.object.isObject(node.data.portsV2);
export const isBlock = (node: BaseModels.BaseDiagramNode): node is BaseModels.BaseBlock =>
  node.type === BaseModels.BaseNodeType.BLOCK;
export const isStart = (node: BaseModels.BaseDiagramNode): node is DBNodeStart => node.type === BlockType.START;
export const isActions = (node: BaseModels.BaseDiagramNode): node is BaseModels.BaseActions =>
  node.type === BaseModels.BaseNodeType.ACTIONS;

const createBlockTypeGuard = createTypeGuardCreator<BlockType>();
const createDBNodeTypeGuard = createTypedTypeGuardCreator<BaseModels.BaseDiagramNode>();
const createNodeDataTypeGuard = createTypedTypeGuardCreator<NodeData<unknown>>();

export const isURLBlockType = createBlockTypeGuard(BlockType.URL);
export const isRootBlockType = createBlockTypeGuard(ROOT_NODES);
export const isIntentBlockType = createBlockTypeGuard(BlockType.INTENT);
export const isSharedBlockType = createBlockTypeGuard(SHARED_NODES);
export const isMarkupBlockType = createBlockTypeGuard(MARKUP_NODES);
export const isActionsBlockType = createBlockTypeGuard(BlockType.ACTIONS);
export const isButtonsBlockType = createBlockTypeGuard(BlockType.BUTTONS);
export const isCarouselBlockType = createBlockTypeGuard(BlockType.CAROUSEL);
export const isCardV2BlockType = createBlockTypeGuard(BlockType.CARDV2);
export const isCombinedBlockType = createBlockTypeGuard(BlockType.COMBINED);
export const isInternalBlockType = createBlockTypeGuard(INTERNAL_NODES);
export const isNavigationBlockType = createBlockTypeGuard(NAVIGATION_NODES);
export const isCanvasChipBlockType = createBlockTypeGuard(CANVAS_CHIPS_NODES);
export const isMarkupMediaBlockType = createBlockTypeGuard(MARKUP_MEDIA_NODES);
export const isDiagramMenuBlockType = createBlockTypeGuard(DIAGRAM_MENU_NODES);
export const isRootOrMarkupBlockType = createBlockTypeGuard(ROOT_AND_MARKUP_NODES);
export const isStartingNodeBlockType = createBlockTypeGuard(STARTING_NODES);
export const isMarkupTemplateBlockType = createBlockTypeGuard(CANVAS_TEMPLATE_NODES);
export const isMarkupOrCombinedBlockType = createBlockTypeGuard(MARKUP_AND_COMBINED_NODES);

export const isBlockDBNode = createDBNodeTypeGuard<BaseModels.BaseBlock>(BaseModels.BaseNodeType.BLOCK);
export const isStartDBNode = createDBNodeTypeGuard<BaseNode.Start.Step<BaseNode.Start.StepData & { steps?: string[] }>>(
  BaseNode.NodeType.START
);
export const isIntentDBNode = createDBNodeTypeGuard<BaseNode.Intent.Step>(BaseNode.NodeType.INTENT);
export const isCommandDBNode = createDBNodeTypeGuard<BaseNode.Command.Step>(BaseNode.NodeType.COMMAND);
export const isGoToNodeDBNode = createDBNodeTypeGuard<BaseNode.GoToNode.Step>(BaseNode.NodeType.GOTO_NODE);
export const isGoToDomainDBNode = createDBNodeTypeGuard<BaseNode.GoToDomain.Step>(BaseNode.NodeType.GOTO_DOMAIN);
export const isDiagramMenuDBNode = createDBNodeTypeGuard<BaseNode.Start.Step | BaseNode.Intent.Step>([
  BaseNode.NodeType.START,
  BaseNode.NodeType.INTENT,
]);

export const isURLNodeData = createNodeDataTypeGuard<NodeData<NodeData.Url>>(BlockType.URL);
export const isExitNodeData = createNodeDataTypeGuard<NodeData<NodeData.Exit>>(BlockType.EXIT);
export const isCodeNodeData = createNodeDataTypeGuard<NodeData<NodeData.Code>>(BlockType.CODE);
export const isSetV2NodeData = createNodeDataTypeGuard<NodeData<NodeData.SetV2>>(BlockType.SETV2);
export const isStartNodeData = createNodeDataTypeGuard<NodeData<NodeData.Start>>(BlockType.START);
export const isIntentNodeData = createNodeDataTypeGuard<NodeData<NodeData.Intent>>(BlockType.INTENT);
export const isCardV2NodeData = createNodeDataTypeGuard<NodeData<NodeData.CardV2>>(BlockType.CARDV2);
export const isCarouselNodeData = createNodeDataTypeGuard<NodeData<NodeData.Carousel>>(BlockType.CAROUSEL);
export const isGoToNodeNodeData = createNodeDataTypeGuard<NodeData<NodeData.GoToNode>>(BlockType.GO_TO_NODE);
export const isRandomV1NodeData = createNodeDataTypeGuard<NodeData<NodeData.Random>>(BlockType.RANDOM);
export const isRandomV2NodeData = createNodeDataTypeGuard<NodeData<NodeData.RandomV2>>(BlockType.RANDOMV2);
export const isComponentNodeData = createNodeDataTypeGuard<NodeData<NodeData.Component>>(BlockType.COMPONENT);
export const isStartingNodesData =
  createNodeDataTypeGuard<NodeData<NodeData.Start | NodeData.Combined>>(STARTING_NODES);
// TODO: remove when FeatureFlag.CMS_WORKFLOWS is released
export const isGoToDomainNodeData = createNodeDataTypeGuard<NodeData<NodeData.GoToDomain>>(BlockType.GO_TO_DOMAIN);
export const isGoToIntentNodeData = createNodeDataTypeGuard<NodeData<NodeData.GoToIntent>>(BlockType.GO_TO_INTENT);
export const isMarkupTextNodeData = createNodeDataTypeGuard<NodeData<Markup.NodeData.Text>>(BlockType.MARKUP_TEXT);
export const isIntegrationNodeData = createNodeDataTypeGuard<NodeData<NodeData.Integration>>(BlockType.INTEGRATION);
export const isMarkupMediaNodeData = createNodeDataTypeGuard<NodeData<Markup.NodeData.Media>>(MARKUP_MEDIA_NODES);
export const isMarkupImageNodeData = createNodeDataTypeGuard<NodeData<Markup.NodeData.Image>>(BlockType.MARKUP_IMAGE);
export const isMarkupVideoNodeData = createNodeDataTypeGuard<NodeData<Markup.NodeData.Video>>(BlockType.MARKUP_VIDEO);
