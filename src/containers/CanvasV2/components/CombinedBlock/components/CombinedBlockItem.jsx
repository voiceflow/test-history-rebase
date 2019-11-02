import React from 'react';

import Flex from '@/componentsV2/Flex';
import { BlockType, INTERNAL_BLOCKS } from '@/constants';
import EnterFlow from '@/containers/CanvasV2/components/EnterFlow';
import { PortSet } from '@/containers/CanvasV2/components/NestedBlock';
import PortLabel from '@/containers/CanvasV2/components/Port/components/PortLabel';
import { ContextMenuTarget, getBlockCategory } from '@/containers/CanvasV2/constants';
import { ContextMenuContext, PlatformContext, TestingModeContext, useNodeData, withNode } from '@/containers/CanvasV2/contexts';
import { NODE_MANAGERS } from '@/containers/CanvasV2/managers';
import { stopPropagation } from '@/utils/dom';

import CombinedBlockContent from './CombinedBlockContent';
import CombinedBlockHandle from './CombinedBlockHandle';
import CombinedBlockItemContainer from './CombinedBlockItemContainer';

const CombinedBlockItem = ({ node, showOutPorts, index, onReorder, onDrop, engine, ...props }) => {
  const { data } = useNodeData();
  const isTesting = React.useContext(TestingModeContext);
  const platform = React.useContext(PlatformContext);
  const contextMenu = React.useContext(ContextMenuContext);

  const { icon, platforms } = NODE_MANAGERS[node.type];
  const { color } = getBlockCategory(node.type);
  const showIcon = !INTERNAL_BLOCKS.includes(node.type);
  const diagram = node.type === BlockType.FLOW && engine.getDiagramByID(data.diagramID);
  const isEnabled = !platforms || platforms.includes(platform);
  const outPorts = showOutPorts && <PortSet ports={node.ports.out} direction="out" withLabel canDrag fullWidth={!diagram} />;

  const openContextMenu = (event) => !isTesting && contextMenu.onOpen(event, ContextMenuTarget.NODE, node.id);

  return (
    <CombinedBlockItemContainer isEnabled={isEnabled} onContextMenu={stopPropagation(openContextMenu)} column {...props}>
      <Flex fullWidth>
        <PortSet ports={node.ports.in} direction="in" canDrop />
        <PortLabel fullWidth>
          {data.name}
          {showIcon && <CombinedBlockHandle icon={icon} color={color} />}
        </PortLabel>
      </Flex>
      {diagram ? (
        <CombinedBlockContent fullWidth>
          <EnterFlow diagramID={data.diagramID} />
          {outPorts}
        </CombinedBlockContent>
      ) : (
        outPorts
      )}
    </CombinedBlockItemContainer>
  );
};

// withNode keeps this from rendering when node does not exist
export default withNode(CombinedBlockItem);
