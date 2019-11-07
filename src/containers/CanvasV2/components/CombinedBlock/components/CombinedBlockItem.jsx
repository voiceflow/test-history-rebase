import React from 'react';

import Flex from '@/componentsV2/Flex';
import { BlockType, INTERNAL_BLOCKS } from '@/constants';
import { PortSet } from '@/containers/CanvasV2/components/NestedBlock';
import PortLabel from '@/containers/CanvasV2/components/Port/components/PortLabel';
import { ContextMenuTarget, getBlockCategory } from '@/containers/CanvasV2/constants';
import { ContextMenuContext, PlatformContext, TestingModeContext, useNodeData, withNode } from '@/containers/CanvasV2/contexts';
import { NODE_MANAGERS } from '@/containers/CanvasV2/managers';
import { stopPropagation } from '@/utils/dom';

import CombinedBlockEnterFlow from './CombinedBlockEnterFlow';
import CombinedBlockHandle from './CombinedBlockHandle';
import CombinedBlockItemContainer from './CombinedBlockItemContainer';

const CombinedBlockItem = ({ node, showOutPorts, index, onReorder, onDrop, engine, ...props }) => {
  const { data } = useNodeData();
  const isTesting = React.useContext(TestingModeContext);
  const platform = React.useContext(PlatformContext);
  const contextMenu = React.useContext(ContextMenuContext);

  React.useEffect(() => {
    engine.node.redrawLinks(node.id);
  }, [index]);

  const { icon, platforms } = NODE_MANAGERS[node.type];
  const { color } = getBlockCategory(node.type);
  const showIcon = !INTERNAL_BLOCKS.includes(node.type);
  const hasDiagram = node.type === BlockType.FLOW && data.diagramID;
  const isEnabled = !platforms || platforms.includes(platform);
  const outPorts = showOutPorts && <PortSet ports={node.ports.out} direction="out" withLabel canDrag fullWidth={!hasDiagram} />;

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
      {hasDiagram ? <CombinedBlockEnterFlow diagramID={data.diagramID}>{outPorts}</CombinedBlockEnterFlow> : outPorts}
    </CombinedBlockItemContainer>
  );
};

// withNode keeps this from rendering when node does not exist
export default withNode(CombinedBlockItem);
