import React from 'react';

import Flex from '@/componentsV2/Flex';
import { BlockType, INTERNAL_BLOCKS } from '@/constants';
import { PortSet } from '@/pages/Canvas/components/NestedBlock';
import PortLabel from '@/pages/Canvas/components/Port/components/PortLabel';
import { ContextMenuTarget, getBlockCategory } from '@/pages/Canvas/constants';
import {
  ContextMenuContext,
  EditPermissionContext,
  EngineContext,
  ManagerContext,
  PlatformContext,
  useNodeData,
  withNode,
} from '@/pages/Canvas/contexts';
import { stopPropagation } from '@/utils/dom';

import CombinedBlockEnterFlow from './CombinedBlockEnterFlow';
import CombinedBlockHandle from './CombinedBlockHandle';
import CombinedBlockItemContainer from './CombinedBlockItemContainer';

const CombinedBlockItem = ({ node, lockOwner, showOutPorts, index, ...props }) => {
  const { data } = useNodeData();
  const { icon, platforms } = React.useContext(ManagerContext)(node.type);
  const engine = React.useContext(EngineContext);
  const { canEdit } = React.useContext(EditPermissionContext);
  const platform = React.useContext(PlatformContext);
  const contextMenu = React.useContext(ContextMenuContext);

  React.useEffect(() => {
    engine.node.redrawLinks(node.id);
  }, [engine.node, index, node.id]);

  const { color } = getBlockCategory(node.type);
  const showIcon = !INTERNAL_BLOCKS.includes(node.type);
  const hasDiagram = node.type === BlockType.FLOW && data.diagramID;
  const isEnabled = !platforms || platforms.includes(platform);
  const outPorts = showOutPorts && <PortSet ports={node.ports.out} direction="out" withLabel canDrag fullWidth={!hasDiagram} />;

  const openContextMenu = (event) => canEdit && contextMenu.onOpen(event, ContextMenuTarget.NODE, node.id);

  return (
    <CombinedBlockItemContainer isEnabled={isEnabled} onContextMenu={stopPropagation(openContextMenu)} column {...props}>
      <Flex fullWidth>
        <PortSet ports={node.ports.in} direction="in" canDrop />
        <PortLabel fullWidth>
          {data.name}
          {showIcon && <CombinedBlockHandle icon={icon} color={color} lockOwner={lockOwner} className="nestedBlockItem" />}
        </PortLabel>
      </Flex>
      {hasDiagram ? <CombinedBlockEnterFlow diagramID={data.diagramID}>{outPorts}</CombinedBlockEnterFlow> : outPorts}
    </CombinedBlockItemContainer>
  );
};

// withNode keeps this from rendering when node does not exist
export default withNode(CombinedBlockItem);
