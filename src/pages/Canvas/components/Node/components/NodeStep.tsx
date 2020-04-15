import React from 'react';

import Portal from '@/components/Portal';
import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { LINK_WIDTH } from '@/pages/Canvas/components/PortV2/constants';
import * as Step from '@/pages/Canvas/components/Step';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { EngineContext, ManagerContext, NodeInjectedProps, PlatformContext, useNodeData, withNode } from '@/pages/Canvas/contexts';
import { buildVirtualDOMRect } from '@/utils/dom';
import { compose } from '@/utils/functional';

import { useNodeLifecycle } from '../hocs';
import { useNodeAPI, useNodeSubscription, useStepAPI } from '../hooks';
import NodePort from './NodePort';

export type NodeStepProps = {
  isLast: boolean;
  isDraggable: boolean;
  variant: BlockVariant;
};

export type ConnectedNodeStepProps = NodeStepProps & NodeInjectedProps & { linkIDs: string[] };

const NodeStep: React.FC<ConnectedNodeStepProps> = ({ nodeID, node, isLast, linkIDs, isDraggable, variant }) => {
  const stepRef = React.useRef<HTMLDivElement>(null);
  const { data } = useNodeData();
  const platform = React.useContext(PlatformContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const engine = React.useContext(EngineContext)!;
  const { step: StepComponent = getManager(BlockType.DEPRECATED).step } = getManager(node?.type)!;
  const nodeAPI = useNodeAPI(nodeID, stepRef);
  const stepAPI = useStepAPI(nodeAPI.isHighlighted, isLast, isDraggable, stepRef);
  const [inPortID] = node?.ports?.in || [];

  const getAnchorPoint = React.useCallback(() => {
    const { x, y } = stepRef.current!.getBoundingClientRect();

    return buildVirtualDOMRect([x - LINK_WIDTH * engine.canvas.getZoom(), y]);
  }, []);

  React.useEffect(() => {
    engine.node.redrawNestedLinks(node.parentNode!);
  }, [data]);

  React.useEffect(() => {
    if (stepAPI.isHovered && (!engine.linkCreation.activeTargetPortID || engine.linkCreation.isCompleting)) {
      stepAPI.setHovering(false);
    }
  }, [linkIDs]);

  useNodeLifecycle();
  useNodeSubscription(nodeID, nodeAPI);

  React.useEffect(() => {
    if (!nodeAPI.isDragging) {
      engine.node.redrawLinks(nodeID);
    }
  }, [nodeAPI.isDragging]);

  if (!node) return null;

  return (
    <>
      {inPortID && <NodePort portID={inPortID} getAnchorPoint={getAnchorPoint} />}
      <StepAPIProvider value={stepAPI}>
        {nodeAPI.isDragging ? (
          <>
            <Step.Placeholder variant={variant} />
            <Portal portalNode={engine.mergeV2.mergeLayer!.ref.current!}>
              <StepComponent node={node} data={data} platform={platform} withPorts={stepAPI.withPorts} />
            </Portal>
          </>
        ) : (
          <StepComponent node={node} data={data} platform={platform} withPorts={stepAPI.withPorts} />
        )}
      </StepAPIProvider>
    </>
  );
};

const mapStateToProps = (state: any, { node }: NodeInjectedProps) => ({
  linkIDs: Creator.linkIDsByPortIDSelector(state)(node.ports.in[0]),
});

export default compose<ConnectedNodeStepProps, NodeStepProps>(
  withNode,
  connect(mapStateToProps, null, null, { forwardRef: true }),
  React.memo
)(NodeStep);
