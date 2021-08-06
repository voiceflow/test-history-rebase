import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import * as Diagram from '@/ducks/diagram';
import * as Project from '@/ducks/project';
import * as Version from '@/ducks/version';
import { compose, connect } from '@/hocs';
import PlayButton from '@/pages/Canvas/components/PlayButton';
import { EngineContext, NodeEntityContext, NodeEntityProvider } from '@/pages/Canvas/contexts';
import { FlowStartBlock, HomeStartBlock } from '@/pages/Canvas/managers/Start/StartBlock';
import { BlockAPI } from '@/pages/Canvas/types';
import { PlatformContext } from '@/pages/Skill/contexts';
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
  const { outPortID, combinedNodes, lockOwner } = nodeEntity.useState((e) => {
    const { node } = e.resolve();
    return {
      outPortID: node.ports.out[0],
      combinedNodes: node.combinedNodes,
      lockOwner: e.lockOwner,
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
      ref={ref}
    />
  );
};

const mapStateToProps = {
  diagram: Diagram.activeDiagramSelector,
  projectName: Project.activeProjectNameSelector,
  invocationName: Version.activeInvocationNameSelector,
  isRootDiagram: Version.isRootDiagramActiveSelector,
};

const mergeProps = (...[{ invocationName, projectName }]: MergeArguments<typeof mapStateToProps>) => ({
  invocationName: invocationName || projectName,
});

type ConnectedNodeStartBlockProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default compose(
  connect(mapStateToProps, null, mergeProps, { forwardRef: true }),
  React.forwardRef
)(NodeStartBlock as any) as React.ForwardRefExoticComponent<NodeStartBlockProps & { ref: React.Ref<BlockAPI> }>;
