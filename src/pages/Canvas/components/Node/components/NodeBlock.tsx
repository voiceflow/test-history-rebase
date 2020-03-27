import React from 'react';

import { BlockState } from '@/constants/canvas';
import { useHover } from '@/hooks';
import Block, { HEADER_HEIGHT, NewBlockAPI } from '@/pages/Canvas/components/Block/NewBlock';
import { EngineContext, NodeIDProvider, useNode, useNodeData } from '@/pages/Canvas/contexts';
import { buildVirtualDOMRect } from '@/utils/dom';

import NodePort from './NodePort';
import NodeStep from './NodeStep';

export type NodeBlockProps = {
  isFocused: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
};

const getBlockState = (props: NodeBlockProps) => {
  if (props.isFocused) return BlockState.ACTIVE;

  if (props.isSelected) return BlockState.SELECTED;

  if (props.isHighlighted) return BlockState.HOVERED;

  return BlockState.REGULAR;
};

const NodeBlock: React.FC<NodeBlockProps> = (props, ref: React.RefObject<{ api: NewBlockAPI }>) => {
  const { nodeID, node, lockOwner } = useNode();
  const { data } = useNodeData();
  const engine = React.useContext(EngineContext)!;
  const [inPortID] = node.ports.in;
  const getAnchorPoint = React.useCallback(() => {
    const { x, y } = ref.current!.api.getBoundingClientRect();

    // account for the correct spacing for the header
    return buildVirtualDOMRect([x, y + 4 * engine.canvas.getZoom()]);
  }, []);

  const [isHovered, wrapElement, hoverHandlers] = useHover(
    {
      onStart: () => {
        if (engine.linkCreation.isDrawing && !node.combinedNodes.some((childNodeID) => engine.linkCreation.isSourceNode(childNodeID))) {
          const { x, y } = getAnchorPoint();

          engine.linkCreation.pin(inPortID, engine.canvas.transformPoint([x, y + (HEADER_HEIGHT / 2) * engine.canvas.getZoom()]));

          return true;
        }

        return false;
      },
      onEnd: () => engine.linkCreation.unpin(),
      cleanupOnOverride: false,
    },
    []
  );

  const updateName = React.useCallback((name) => engine.node.updateData(nodeID, { name }), [engine, nodeID]);
  const updateBlockColor = React.useCallback((blockColor) => engine.node.updateData(nodeID, { blockColor }), [engine, nodeID]);

  return (
    <>
      {inPortID && <NodePort portID={inPortID} getAnchorPoint={getAnchorPoint} />}
      {wrapElement(
        <Block
          name={data.name}
          state={isHovered ? BlockState.HOVERED : getBlockState(props)}
          updateName={updateName}
          updateBlockColor={updateBlockColor}
          lockOwner={lockOwner}
          ref={ref}
          canEditTitle
          {...hoverHandlers}
        >
          {node.combinedNodes.map((stepNodeID, index) => (
            <NodeIDProvider value={stepNodeID} key={stepNodeID}>
              <NodeStep isLast={index === node.combinedNodes.length - 1} />
            </NodeIDProvider>
          ))}
        </Block>
      )}
    </>
  );
};

export default React.forwardRef(NodeBlock);
