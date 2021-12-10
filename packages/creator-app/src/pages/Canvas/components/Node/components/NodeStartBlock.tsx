import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
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

  const { variant, nodeName, lockOwner, nodeLabel, nextPortID, combinedNodes } = nodeEntity.useState((e) => {
    const { node, data } = e.resolve<Realtime.NodeData.Start>();
    return {
      variant: data.blockColor,
      nodeName: data.name,
      lockOwner: e.lockOwner,
      nodeLabel: data.label,
      nextPortID: node.ports.out.builtIn[Models.PortType.NEXT]!,
      combinedNodes: node.combinedNodes,
    };
  });

  useDidUpdateEffect(() => {
    engine.node.redrawLinks(nodeEntity.nodeID);
  }, [combinedNodes]);

  const commands = combinedNodes.length
    ? combinedNodes.map((commandNodeID) => (
        <NodeEntityProvider id={commandNodeID} key={commandNodeID}>
          <NodeStep isDraggable={false} variant={variant ?? BlockVariant.STANDARD} isLast />
        </NodeEntityProvider>
      ))
    : null;

  const actions = <PlayButton nodeID={nodeEntity.nodeID} />;

  if (isRootDiagram) {
    return (
      <HomeStartBlock
        ref={ref}
        name={nodeName}
        label={nodeLabel}
        nodeID={nodeEntity.nodeID}
        portID={nextPortID}
        variant={variant}
        actions={actions}
        platform={platform}
        commands={commands}
        lockOwner={lockOwner}
        invocationName={invocationName ?? ''}
      />
    );
  }

  return (
    <FlowStartBlock
      ref={ref}
      name={nodeName ?? diagram?.name}
      label={nodeLabel}
      nodeID={nodeEntity.nodeID}
      portID={nextPortID}
      variant={variant}
      actions={actions}
      commands={commands}
      lockOwner={lockOwner}
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
