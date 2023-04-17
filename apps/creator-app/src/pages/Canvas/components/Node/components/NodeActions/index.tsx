import { BaseModels } from '@voiceflow/base-types';
import { Struct } from '@voiceflow/common';
import { PathPoints } from '@voiceflow/realtime-sdk';
import { Canvas, swallowEvent, useDidUpdateEffect, usePersistFunction, useToggle } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { generatePath } from 'react-router';

import { HIGHLIGHT_COLOR, STROKE_DEFAULT_COLOR } from '@/pages/Canvas/components/Link/constants';
import { useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import LinkPath from '@/pages/Canvas/components/Port/components/PortLinkPath';
import LinkSvg from '@/pages/Canvas/components/Port/components/PortLinkSvg';
import { NODE_LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { ActionsPortAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { ActionsRouteMatchContext, EngineContext, IsStraightLinksContext, NodeEntityContext, NodeEntityProvider } from '@/pages/Canvas/contexts';
import { PATH } from '@/pages/Canvas/managers/components/Actions/constants';
import { ClassName } from '@/styles/constants';

import NodeActionStep from '../NodeActionStep';
import NodeLifecycle from '../NodeLifecycle';
import * as S from './styles';

interface NodeActionsProps {
  isChip?: boolean;
  parentPath?: string;
  sourcePortID: string;
  sourceNodeID: string;
  parentParams?: Record<string, string>;
}

const NodeActions: React.FC<NodeActionsProps> = ({ isChip, parentPath, parentParams, sourcePortID, sourceNodeID }) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const isStraightLinks = React.useContext(IsStraightLinksContext)!;
  const actionsRouteMatch = React.useContext(ActionsRouteMatchContext);
  const onPositionUpdatedRef = React.useRef<null | VoidFunction>(null);

  const instance = useNodeInstance<HTMLDivElement>();

  const { combinedNodes, isHighlighted, lastCombinedLink, isLinkCreationStartFomLastCombined } = nodeEntity.useState((e) => {
    const { node } = e.resolve();
    const lastCombinedLink = e.resolveLastCombinedLink();

    const lastCombinedPortID = lastCombinedLink?.source.portID;
    const lastCombinedPortEntity = lastCombinedPortID ? engine.ports.get(lastCombinedPortID) : null;

    return {
      combinedNodes: node.combinedNodes,
      isHighlighted: (lastCombinedPortEntity?.api.isHighlighted || lastCombinedPortEntity?.api.isPrototypeHighlighted) ?? false,
      lastCombinedLink,
      isLinkCreationStartFomLastCombined: engine.linkCreation.isSourceNode(node.combinedNodes[node.combinedNodes.length - 1]),
    };
  });

  const linkColor = lastCombinedLink?.data?.color;
  const linkReversed = lastCombinedLink?.data?.points?.[0]?.reversed ?? false;
  const hasCombinedLink = !!lastCombinedLink;
  const openedActionNodeID = actionsRouteMatch?.params?.actionNodeID;

  const [reversed, toggleReversed] = useToggle(linkReversed);

  const isStraight = lastCombinedLink?.data?.type ? lastCombinedLink.data.type === BaseModels.Project.LinkType.STRAIGHT : isStraightLinks;

  const onReverseUpdate = React.useCallback((points: PathPoints | null) => toggleReversed(points?.[0].reversed ?? false), []);

  const onOpenEditor = usePersistFunction((actionNodeID: string, routeState?: Struct) => {
    engine.setActive(sourceNodeID, {
      routeState,
      nodeSubPath: generatePath(parentPath ? `${parentPath}/${PATH}` : PATH, { ...parentParams, sourcePortID, actionNodeID }),
    });
  });

  useDidUpdateEffect(() => {
    toggleReversed(isStraight ? linkReversed : false);
  }, [isStraight, linkReversed]);

  useDidUpdateEffect(() => {
    if (!hasCombinedLink && !isLinkCreationStartFomLastCombined) {
      toggleReversed(false);
    }
  }, [hasCombinedLink, isLinkCreationStartFomLastCombined]);

  const api = React.useMemo(
    () => ({
      updatePosition: (points: PathPoints | null, onPositionUpdates?: VoidFunction) => {
        onReverseUpdate(points);

        onPositionUpdatedRef.current = onPositionUpdates ?? null;
      },
    }),
    []
  );

  React.useLayoutEffect(() => onPositionUpdatedRef.current?.(), [reversed]);

  nodeEntity.useInstance(instance);

  const color = isHighlighted ? HIGHLIGHT_COLOR : linkColor ?? STROKE_DEFAULT_COLOR;

  return (
    <ActionsPortAPIProvider value={api}>
      <NodeLifecycle />

      <LinkSvg isAction reversed={reversed} shapeRendering="geometricPrecision">
        <LinkPath d={`M 0 4 L ${NODE_LINK_WIDTH} 4`} isHighlighted={isHighlighted} strokeColor={color} />
      </LinkSvg>

      <S.Container
        ref={instance.ref}
        isChip={isChip}
        tabIndex={-1}
        reversed={reversed}
        draggable={false}
        className={cn(ClassName.CANVAS_NODE, `${ClassName.CANVAS_NODE}--${nodeEntity.nodeType}`)}
        onMouseDown={swallowEvent(null, true)}
        data-node-id={nodeEntity.nodeID}
      >
        {combinedNodes.map((stepNodeID, index) => (
          <NodeEntityProvider id={stepNodeID} key={stepNodeID}>
            <Canvas.Action.Connector small={index === 0} style={{ color }} reversed={reversed} />

            <NodeActionStep
              isLast={index === combinedNodes.length - 1}
              isActive={stepNodeID === openedActionNodeID}
              reversed={reversed}
              sourcePortID={sourcePortID}
              sourceNodeID={sourceNodeID}
              onOpenEditor={onOpenEditor}
            />
          </NodeEntityProvider>
        ))}
      </S.Container>
    </ActionsPortAPIProvider>
  );
};

export default React.memo(NodeActions);
