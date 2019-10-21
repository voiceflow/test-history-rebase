import React from 'react';

import EnterFlow from '@/containers/CanvasV2/components/EnterFlow';
import NestedBlock from '@/containers/CanvasV2/components/NestedBlock';
import PortLabel from '@/containers/CanvasV2/components/Port/components/PortLabel';
import { ContextMenuTarget } from '@/containers/CanvasV2/constants';
import { ContextMenuContext, TestingModeContext, withNode } from '@/containers/CanvasV2/contexts';
import { diagramByIDSelector } from '@/ducks/diagram';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { stopPropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import CommandBlockContainer from './CommandBlockContainer';

const CommandBlock = ({ data, node, platform, diagram: getDiagram }) => {
  const isTesting = React.useContext(TestingModeContext);
  const contextMenu = React.useContext(ContextMenuContext);
  const platformData = data[platform];
  const diagram = platformData.diagramID && getDiagram(platformData.diagramID);

  const openContextMenu = (event) => !isTesting && contextMenu.onOpen(event, ContextMenuTarget.NODE, node.id);

  return (
    <NestedBlock node={node} canDrag={false} onContextMenu={stopPropagation(openContextMenu)}>
      <CommandBlockContainer>
        <PortLabel>{data.name}</PortLabel>
        {diagram && <EnterFlow label={data.name} diagramID={platformData.diagramID} />}
      </CommandBlockContainer>
    </NestedBlock>
  );
};

export const mapStateToProps = {
  platform: activePlatformSelector,
  diagram: diagramByIDSelector,
};

export default compose(
  withNode,
  connect(mapStateToProps)
)(CommandBlock);
