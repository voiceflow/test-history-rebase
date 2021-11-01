import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import * as Creator from '@/ducks/creator';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { compose, connect } from '@/hocs';
import PlayButton from '@/pages/Canvas/components/PlayButton';
import { EngineContext, NodeEntityContext, NodeEntityProvider } from '@/pages/Canvas/contexts';
import { FlowStartBlock, HomeStartBlock } from '@/pages/Canvas/managers/Start/StartBlock';
import { BlockAPI } from '@/pages/Canvas/types';
import { PlatformContext } from '@/pages/Project/contexts';
import { ConnectedProps, MergeArguments } from '@/types';

import NodeStep from './NodeStep';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NodeStartBlockProps {}

const NodeStartBlock: React.ForwardRefRenderFunction<BlockAPI, NodeStartBlockProps & ConnectedNodeStartBlockProps> = (
  { invocationName, isRootDiagram, diagram },
  ref
) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const platform = React.useContext(PlatformContext)!;
  const { outPortID, combinedNodes, lockOwner, nodeLabel } = nodeEntity.useState((e) => {
    const { node, data } = e.resolve();
    return {
      outPortID: node.ports.out[0],
      lockOwner: e.lockOwner,
      nodeLabel: (data as any).label,
      combinedNodes: node.combinedNodes,
    };
  });

  useDidUpdateEffect(() => {
    engine.node.redrawLinks(nodeEntity.nodeID);
  }, [combinedNodes]);

  const commands = combinedNodes.length
    ? combinedNodes.map((commandNodeID) => (
        <NodeEntityProvider id={commandNodeID} key={commandNodeID}>
          <NodeStep isDraggable={false} variant={BlockVariant.STANDARD} isLast />
        </NodeEntityProvider>
      ))
    : null;

  const actions = <PlayButton nodeID={nodeEntity.nodeID} />;

  if (isRootDiagram) {
    return (
      <HomeStartBlock
        nodeID={nodeEntity.nodeID}
        portID={outPortID}
        platform={platform}
        invocationName={invocationName ?? ''}
        commands={commands}
        actions={actions}
        label={nodeLabel}
        lockOwner={lockOwner}
        ref={ref}
      />
    );
  }

  return (
    <FlowStartBlock
      nodeID={nodeEntity.nodeID}
      portID={outPortID}
      name={diagram?.name}
      commands={commands}
      actions={actions}
      lockOwner={lockOwner}
      label={nodeLabel}
      ref={ref}
    />
  );
};

const mapStateToProps = {
  diagram: DiagramV2.active.diagramSelector,
  projectName: ProjectV2.active.nameSelector,
  invocationName: VersionV2.active.invocationNameSelector,
  isRootDiagram: Creator.isRootDiagramActiveSelector,
};

const mergeProps = (...[{ invocationName, projectName }]: MergeArguments<typeof mapStateToProps>) => ({
  invocationName: invocationName || projectName,
});

type ConnectedNodeStartBlockProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default compose(
  connect(mapStateToProps, null, mergeProps, { forwardRef: true }),
  React.forwardRef
)(NodeStartBlock as any) as React.ForwardRefExoticComponent<NodeStartBlockProps & { ref: React.Ref<BlockAPI> }>;
