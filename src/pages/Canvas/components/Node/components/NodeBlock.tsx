import React from 'react';

import { BlockState, BlockVariant } from '@/constants/canvas';
import { useEnableDisable, useHover } from '@/hooks';
import Block, { HEADER_HEIGHT, NewBlockAPI } from '@/pages/Canvas/components/Block/NewBlock';
import { REORDER_INDICATOR_CLASSNAME } from '@/pages/Canvas/components/Step/constants';
import { EngineContext, NodeIDProvider, useNode, useNodeData } from '@/pages/Canvas/contexts';
import { buildVirtualDOMRect } from '@/utils/dom';

import NodePort from './NodePort';
import NodeStep from './NodeStep';
import ReorderIndicator from './ReorderIndicator';
import SourceReorderIndicator from './SourceReorderIndicator';
import TerminalReorderIndicator from './TerminalReorderIndicator';

export type NodeBlockProps = {
  isFocused: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
};

const getBlockState = (props: NodeBlockProps, { isHovered, hasLinkWarning }: { isHovered: boolean; hasLinkWarning: boolean }) => {
  if (isHovered && hasLinkWarning) return BlockState.DISABLED;

  if (props.isFocused) return BlockState.ACTIVE;

  if (props.isSelected) return BlockState.SELECTED;

  if (props.isHighlighted || isHovered) return BlockState.HOVERED;

  return BlockState.REGULAR;
};

const NodeBlock: React.FC<NodeBlockProps> = (props, ref: React.RefObject<{ api: NewBlockAPI }>) => {
  const isTransitioning = React.useRef(false);
  const { nodeID, node, lockOwner } = useNode();
  const { data } = useNodeData();
  const engine = React.useContext(EngineContext)!;
  const [inPortID] = node.ports.in;
  const getAnchorPoint = React.useCallback(() => {
    const { x, y } = ref.current!.api.getBoundingClientRect();

    // account for the correct spacing for the header
    return buildVirtualDOMRect([x, y + 4 * engine.canvas.getZoom()]);
  }, []);
  const [hasLinkWarning, setLinkWarning, clearLinkWarning] = useEnableDisable();
  const hasNestedInPort = engine.getNodeByID(node.combinedNodes[0]).ports.in.length !== 0;
  const [isHovered, wrapElement, hoverHandlers] = useHover(
    {
      onStart: () => {
        const isPinned = engine.linkCreation.hasPin;

        if (engine.linkCreation.isDrawing && !engine.linkCreation.containsSourcePort(nodeID)) {
          // added inPortID for the cases if combined block itself has no IN port
          if (!hasNestedInPort) {
            setLinkWarning();

            if (isPinned) {
              engine.linkCreation.unpin();
            }

            return true;
          }

          const { x, y } = getAnchorPoint();

          engine.linkCreation.pin(inPortID, engine.canvas.transformPoint([x, y + (HEADER_HEIGHT / 2) * engine.canvas.getZoom()]));

          return true;
        }

        if (isPinned) {
          engine.linkCreation.unpin();
        }

        return false;
      },
      onEnd: () => {
        if (!hasNestedInPort) {
          clearLinkWarning();
          return;
        }

        engine.linkCreation.unpin();
      },
      cleanupOnOverride: false,
    },
    [hasNestedInPort]
  );

  const updateName = React.useCallback((name) => engine.node.updateData(nodeID, { name }), [engine, nodeID]);
  const updateBlockColor = React.useCallback((blockColor) => engine.node.updateData(nodeID, { blockColor }), [engine, nodeID]);

  const onInsert = (index: number) => async (event: React.MouseEvent) => {
    if (engine.drag.hasTarget) {
      const target = engine.drag.target!;

      event.preventDefault();
      await engine.drag.reset();

      await engine.node.insertNested(nodeID, index, target);
    }
  };

  React.useEffect(() => {
    let redrawTimer: number | null = null;
    const isTarget = (event: TransitionEvent) =>
      event.propertyName === 'height' && (event.target! as HTMLElement).classList.contains(REORDER_INDICATOR_CLASSNAME);
    const onTransitionStart = (event: TransitionEvent) => {
      if (isTarget(event)) {
        isTransitioning.current = true;
        redrawTimer = setInterval(() => engine.node.redrawNestedLinks(nodeID), 1);
      }
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (isTransitioning.current) {
        clearInterval(redrawTimer!);
        isTransitioning.current = false;
      }

      if (isTarget(event)) {
        engine.node.redrawNestedLinks(nodeID);
      }
    };

    const rootEl = ref.current?.api.ref.current!;

    rootEl.addEventListener('transitionstart', onTransitionStart);
    rootEl.addEventListener('transitionend', onTransitionEnd);
    rootEl.addEventListener('transitioncancel', onTransitionEnd);

    return () => {
      rootEl.removeEventListener('transitionstart', onTransitionStart);
      rootEl.removeEventListener('transitionend', onTransitionEnd);
      rootEl.removeEventListener('transitioncancel', onTransitionEnd);
    };
  }, []);

  return (
    <>
      {inPortID && !hasLinkWarning && <NodePort portID={inPortID} getAnchorPoint={getAnchorPoint} />}
      {wrapElement(
        <Block
          name={data.name}
          state={getBlockState(props, { isHovered, hasLinkWarning })}
          variant={data.blockColor || BlockVariant.STANDARD}
          updateName={updateName}
          updateBlockColor={updateBlockColor}
          lockOwner={lockOwner}
          ref={ref}
          canEditTitle
          hasLinkWarning={hasLinkWarning}
          {...hoverHandlers}
        >
          {node.combinedNodes.map((stepNodeID, index) => (
            <NodeIDProvider value={stepNodeID} key={stepNodeID}>
              {index === 0 && <SourceReorderIndicator index={0} onMouseUp={onInsert(0)} />}
              <NodeStep isDraggable={node.combinedNodes.length > 1} isLast={index === node.combinedNodes.length - 1} />
              {index === node.combinedNodes.length - 1 ? (
                <TerminalReorderIndicator index={index + 1} onMouseUp={onInsert(index + 1)} />
              ) : (
                <ReorderIndicator index={index + 1} onMouseUp={onInsert(index + 1)} />
              )}
            </NodeIDProvider>
          ))}
        </Block>
      )}
    </>
  );
};

export default React.forwardRef(NodeBlock);
