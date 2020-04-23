import React from 'react';

import { BlockState, BlockVariant } from '@/constants/canvas';
import * as Diagram from '@/ducks/diagram';
import * as Skill from '@/ducks/skill';
import { compose, connect } from '@/hocs';
import { BlockAPI } from '@/pages/Canvas/components/Block';
import { NodeIDProvider, PlatformContext, useNode } from '@/pages/Canvas/contexts';
import { BaseStartBlockProps, FlowStartBlock, HomeStartBlock } from '@/pages/Canvas/managers/Start/StartBlock';
import { ConnectedProps, MergeArguments } from '@/types';

import NodeStep from './NodeStep';

export type NodeStartBlockProps = Omit<BaseStartBlockProps, 'commands'> & {
  invocationName: string;
  isRootDiagram: boolean;
  isFocused: boolean;
  isSelected: boolean;
};

const getBlockState = ({ isFocused, isSelected, isHighlighted }: { isFocused: boolean; isSelected: boolean; isHighlighted: boolean }) => {
  if (isFocused) return BlockState.ACTIVE;

  if (isSelected) return BlockState.SELECTED;

  if (isHighlighted) return BlockState.HOVERED;

  return BlockState.REGULAR;
};

const NodeStartBlock: React.RefForwardingComponent<{ api: BlockAPI }, React.PropsWithChildren<NodeStartBlockProps> & ConnectedNodeStartBlockProps> = (
  { isRootDiagram, diagram, invocationName, isFocused, isSelected, ...props },
  ref
) => {
  const { node, lockOwner, isHighlighted } = useNode();
  const platform = React.useContext(PlatformContext)!;
  const [portID] = node.ports.out;
  const blockState = isHighlighted ? BlockState.ACTIVE : BlockState.REGULAR;
  const commands = node.combinedNodes.length
    ? node.combinedNodes.map((commandNodeID) => (
        <NodeIDProvider value={commandNodeID} key={commandNodeID}>
          <NodeStep isDraggable={false} variant={BlockVariant.STANDARD} isLast />
        </NodeIDProvider>
      ))
    : null;

  if (isRootDiagram) {
    return (
      <HomeStartBlock
        {...props}
        state={getBlockState({ isFocused, isSelected, isHighlighted })}
        portID={portID}
        platform={platform}
        invocationName={invocationName}
        commands={commands}
        lockOwner={lockOwner}
        ref={ref}
      />
    );
  }

  return <FlowStartBlock {...props} state={blockState} portID={portID} name={diagram?.name} commands={commands} lockOwner={lockOwner} ref={ref} />;
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

type ConnectedNodeStartBlockProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default compose(
  connect(mapStateToProps, null, mergeProps, { forwardRef: true }),
  React.forwardRef
)<React.PropsWithChildren<NodeStartBlockProps>, { api: BlockAPI }>(NodeStartBlock as React.FC);
