import React from 'react';

import { BlockType } from '@/constants';
import CombinedBlockItem from '@/containers/CanvasV2/components/CombinedBlock/components/CombinedBlockItem';
import EnterFlow from '@/containers/CanvasV2/components/EnterFlow';
import NestedBlock from '@/containers/CanvasV2/components/NestedBlock';
import PortLabel from '@/containers/CanvasV2/components/Port/components/PortLabel';
import { ContextMenuTarget } from '@/containers/CanvasV2/constants';
import { ContextMenuContext, EngineContext, PlatformContext, TestingModeContext, withNode, withNodeData } from '@/containers/CanvasV2/contexts';
import { stopPropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import CommandBlockContainer from './CommandBlockContainer';

const CommandBlock = ({ data, node }) => {
  const engine = React.useContext(EngineContext);
  const platform = React.useContext(PlatformContext);
  const isTesting = React.useContext(TestingModeContext);
  const contextMenu = React.useContext(ContextMenuContext);
  const platformData = data[platform];

  if (node.type !== BlockType.COMMAND) return <CombinedBlockItem />;

  const diagram = platformData.diagramID && engine.getDiagramByID(platformData.diagramID);

  const openContextMenu = (event) => !isTesting && contextMenu.onOpen(event, ContextMenuTarget.NODE, node.id);

  return (
    <NestedBlock canDrag={false} onContextMenu={stopPropagation(openContextMenu)}>
      <CommandBlockContainer>
        <PortLabel>{data.name}</PortLabel>
        {diagram && <EnterFlow label={data.name} diagramID={platformData.diagramID} />}
      </CommandBlockContainer>
    </NestedBlock>
  );
};

export default compose(
  withNode,
  withNodeData
)(CommandBlock);
