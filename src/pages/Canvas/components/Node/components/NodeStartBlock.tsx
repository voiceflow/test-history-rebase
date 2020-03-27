import React from 'react';

import { BlockState } from '@/constants/canvas';
import * as Diagram from '@/ducks/diagram';
import * as Skill from '@/ducks/skill';
import { compose, connect } from '@/hocs';
import { NewBlockAPI } from '@/pages/Canvas/components/Block/NewBlock';
import { NodeIDProvider, PlatformContext, useNode } from '@/pages/Canvas/contexts';
import { BaseStartBlockProps, FlowStartBlock, HomeStartBlock } from '@/pages/Canvas/managers/Start/StartBlock';
import { MergeProps } from '@/types';

import NodeStep from './NodeStep';

export type NodeStartBlockProps = Omit<BaseStartBlockProps, 'commands'> & {
  invocationName: string;
  isRootDiagram: boolean;
  diagram: { name: string };
};

const NodeStartBlock: React.RefForwardingComponent<{ api: NewBlockAPI }, React.PropsWithChildren<NodeStartBlockProps>> = (
  { isRootDiagram, diagram, invocationName, ...props },
  ref
) => {
  const { node, lockOwner, isHighlighted } = useNode();
  const platform = React.useContext(PlatformContext)!;
  const [portID] = node.ports.out;
  const blockState = isHighlighted ? BlockState.ACTIVE : BlockState.REGULAR;
  const commands = node.combinedNodes.map((commandNodeID) => (
    <NodeIDProvider value={commandNodeID} key={commandNodeID}>
      <NodeStep isLast />
    </NodeIDProvider>
  ));

  if (isRootDiagram) {
    return (
      <HomeStartBlock
        {...props}
        state={blockState}
        portID={portID}
        platform={platform}
        invocationName={invocationName}
        commands={commands}
        lockOwner={lockOwner}
        ref={ref}
      />
    );
  }

  return <FlowStartBlock {...props} state={blockState} portID={portID} name={diagram.name} commands={commands} lockOwner={lockOwner} ref={ref} />;
};

const mapStateToProps = {
  invocationName: Skill.invNameSelector,
  isRootDiagram: Skill.isRootDiagramSelector,
  activeDiagramID: Skill.activeDiagramIDSelector,
  diagram: Diagram.diagramByIDSelector,
};

const mergeProps: MergeProps<typeof mapStateToProps> = ({ diagram: getDiagramByID, activeDiagramID }) => ({
  diagram: getDiagramByID(activeDiagramID),
});

export default compose(connect(mapStateToProps, null, mergeProps, { forwardRef: true }), React.forwardRef)(NodeStartBlock);
