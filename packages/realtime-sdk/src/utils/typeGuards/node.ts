import {
  BlockType,
  CANVAS_CHIPS_NODES,
  DIAGRAM_REFERENCE_NODES,
  INTERNAL_NODES,
  MARKUP_AND_COMBINED_NODES,
  MARKUP_MEDIA_NODES,
  MARKUP_NODES,
  NAVIGATION_NODES,
  ROOT_AND_MARKUP_NODES,
  ROOT_NODES,
} from '@realtime-sdk/constants';
import { DBNodeStart, Markup, NodeData } from '@realtime-sdk/models';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';

import { createTypedTypeGuardCreator, createTypeGuardCreator } from './utils';

export const isStep = <Data extends AnyRecord = AnyRecord, Ports = BaseModels.NextStepPorts, PortsOld = BaseModels.BasePortList>(
  node: BaseModels.BaseDiagramNode
): node is BaseModels.BaseStep<Data, Ports, PortsOld> => Array.isArray(node.data.ports) || Utils.object.isObject(node.data.portsV2);
export const isBlock = (node: BaseModels.BaseDiagramNode): node is BaseModels.BaseBlock => node.type === BaseModels.BaseNodeType.BLOCK;
export const isStart = (node: BaseModels.BaseDiagramNode): node is DBNodeStart => node.type === BlockType.START;
export const isActions = (node: BaseModels.BaseDiagramNode): node is BaseModels.BaseActions => node.type === BaseModels.BaseNodeType.ACTIONS;

const createBlockTypeGuard = createTypeGuardCreator<BlockType>();
const createDBNodeTypeGuard = createTypedTypeGuardCreator<BaseModels.BaseDiagramNode>();
const createNodeDataTypeGuard = createTypedTypeGuardCreator<NodeData<unknown>>();

export const isURLBlockType = createBlockTypeGuard(BlockType.URL);
export const isRootBlockType = createBlockTypeGuard(ROOT_NODES);
export const isMarkupBlockType = createBlockTypeGuard(MARKUP_NODES);
export const isActionsBlockType = createBlockTypeGuard(BlockType.ACTIONS);
export const isButtonsBlockType = createBlockTypeGuard(BlockType.BUTTONS);
export const isInternalBlockType = createBlockTypeGuard(INTERNAL_NODES);
export const isNavigationBlockType = createBlockTypeGuard(NAVIGATION_NODES);
export const isCanvasChipBlockType = createBlockTypeGuard(CANVAS_CHIPS_NODES);
export const isMarkupMediaBlockType = createBlockTypeGuard(MARKUP_MEDIA_NODES);
export const isRootOrMarkupBlockType = createBlockTypeGuard(ROOT_AND_MARKUP_NODES);
export const isMarkupOrCombinedBlockType = createBlockTypeGuard(MARKUP_AND_COMBINED_NODES);
export const isDiagramReferencesBlockType = createBlockTypeGuard(DIAGRAM_REFERENCE_NODES);

export const isIntentDBNode = createDBNodeTypeGuard<BaseNode.Intent.Step>(BaseNode.NodeType.INTENT);

export const isIntentNodeData = createNodeDataTypeGuard<NodeData<NodeData.Intent>>(BlockType.INTENT);
export const isMarkupTextNodeData = createNodeDataTypeGuard<NodeData<Markup.NodeData.Text>>(BlockType.MARKUP_TEXT);
export const isMarkupMediaNodeData = createNodeDataTypeGuard<NodeData<Markup.NodeData.Media>>(MARKUP_MEDIA_NODES);
export const isMarkupImageNodeData = createNodeDataTypeGuard<NodeData<Markup.NodeData.Image>>(BlockType.MARKUP_IMAGE);
export const isMarkupVideoNodeData = createNodeDataTypeGuard<NodeData<Markup.NodeData.Video>>(BlockType.MARKUP_VIDEO);
export const isCarouselNodeData = createNodeDataTypeGuard<NodeData<NodeData.Carousel>>(BlockType.CAROUSEL);
export const isCardV2NodeData = createNodeDataTypeGuard<NodeData<NodeData.CardV2>>(BlockType.CARDV2);
export const isRandomV2NodeData = createNodeDataTypeGuard<NodeData<NodeData.RandomV2>>(BlockType.RANDOMV2);
export const isRandomV1NodeData = createNodeDataTypeGuard<NodeData<NodeData.Random>>(BlockType.RANDOM);
