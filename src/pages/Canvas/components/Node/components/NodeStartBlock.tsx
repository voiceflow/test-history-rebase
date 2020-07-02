import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import * as Diagram from '@/ducks/diagram';
import * as Skill from '@/ducks/skill';
import { compose, connect } from '@/hocs';
import * as Models from '@/models';
import { NodeEntityContext, NodeEntityProvider, PlatformContext } from '@/pages/Canvas/contexts';
import { FlowStartBlock, HomeStartBlock } from '@/pages/Canvas/managers/Start/StartBlock';
import { BlockAPI } from '@/pages/Canvas/types';
import { MergeArguments } from '@/types';

import NodeStep from './NodeStep';

export type NodeStartBlockProps = {};

const NodeStartBlock: React.ForwardRefRenderFunction<BlockAPI, NodeStartBlockProps & ConnectedNodeStartBlockProps> = (
  { invocationName, isRootDiagram, diagram },
  ref
) => {
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
  const commands = combinedNodes.length
    ? combinedNodes.map((commandNodeID) => (
        <NodeEntityProvider id={commandNodeID} key={commandNodeID}>
          <NodeStep isDraggable={false} variant={BlockVariant.STANDARD} isLast />
        </NodeEntityProvider>
      ))
    : null;

  if (isRootDiagram) {
    return (
      <HomeStartBlock portID={outPortID} platform={platform} invocationName={invocationName} commands={commands} lockOwner={lockOwner} ref={ref} />
    );
  }

  return <FlowStartBlock portID={outPortID} name={diagram?.name} commands={commands} lockOwner={lockOwner} ref={ref} />;
};

const mapStateToProps = {
  invocationName: Skill.invNameSelector,
  isRootDiagram: Skill.isRootDiagramSelector,
  activeDiagramID: Skill.activeDiagramIDSelector,
  diagram: Diagram.diagramByIDSelector,
};

const mergeProps = (...[{ diagram: getDiagramByID, activeDiagramID }]: MergeArguments<typeof mapStateToProps>) => ({
  diagram: getDiagramByID(activeDiagramID),
});

type ConnectedNodeStartBlockProps = {
  invocationName: string;
  isRootDiagram: boolean;
  diagram?: Models.Diagram;
};

export default compose(
  connect(mapStateToProps, null, mergeProps, { forwardRef: true }),
  React.forwardRef
)(NodeStartBlock as any) as React.ForwardRefExoticComponent<NodeStartBlockProps & { ref: React.Ref<BlockAPI> }>;
