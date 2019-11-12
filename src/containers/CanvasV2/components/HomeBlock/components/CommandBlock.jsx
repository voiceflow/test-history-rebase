import React from 'react';

import { BlockType } from '@/constants';
import CombinedBlockItem from '@/containers/CanvasV2/components/CombinedBlock/components/CombinedBlockItem';
import EnterFlow from '@/containers/CanvasV2/components/EnterFlow';
import NestedBlock from '@/containers/CanvasV2/components/NestedBlock';
import PortLabel from '@/containers/CanvasV2/components/Port/components/PortLabel';
import { ContextMenuTarget } from '@/containers/CanvasV2/constants';
import { ContextMenuContext, TestingModeContext, withNode, withNodeData } from '@/containers/CanvasV2/contexts';
import { diagramByIDSelector } from '@/ducks/diagram';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { stopPropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import CommandBlockContainer from './CommandBlockContainer';

const CommandBlock = ({ data, platformData, diagram, node, engine }) => {
  const isTesting = React.useContext(TestingModeContext);
  const contextMenu = React.useContext(ContextMenuContext);

  if (node.type !== BlockType.COMMAND) return <CombinedBlockItem engine={engine} />;

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

const mapStateToProps = {
  platform: activePlatformSelector,
  diagram: diagramByIDSelector,
};

const mergeProps = ({ platform, diagram: getDiagramByID }, _, { data }) => {
  const platformData = data[platform];

  return {
    platformData,
    diagram: platformData?.diagramID && getDiagramByID(platformData.diagramID),
  };
};

export default compose(
  withNode,
  withNodeData,
  connect(
    mapStateToProps,
    null,
    mergeProps
  )
)(CommandBlock);
