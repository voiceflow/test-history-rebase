import React from 'react';

import User from '@/components/User';
import Flex from '@/componentsV2/Flex';
import { BlockType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import CombinedBlockItem from '@/pages/Canvas/components/CombinedBlock/components/CombinedBlockItem';
import EnterFlow from '@/pages/Canvas/components/EnterFlow';
import NestedBlock from '@/pages/Canvas/components/NestedBlock';
import PortLabel from '@/pages/Canvas/components/Port/components/PortLabel';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { ContextMenuContext, EditPermissionContext, withNode, withNodeData } from '@/pages/Canvas/contexts';
import { stopPropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import CommandBlockContainer from './CommandBlockContainer';

const CommandBlock = ({ data, platformData, diagram, node, lockOwner }) => {
  const { canEdit } = React.useContext(EditPermissionContext);
  const contextMenu = React.useContext(ContextMenuContext);

  if (node.type !== BlockType.COMMAND) return <CombinedBlockItem />;

  const openContextMenu = (event) => canEdit && contextMenu.onOpen(event, ContextMenuTarget.NODE, node.id);

  return (
    <NestedBlock canDrag={false} onContextMenu={stopPropagation(openContextMenu)}>
      <CommandBlockContainer>
        <PortLabel>{data.name}</PortLabel>
        <Flex>
          {lockOwner && <User user={lockOwner} />}
          {diagram && <EnterFlow label={data.name} diagramID={platformData.diagramID} />}
        </Flex>
      </CommandBlockContainer>
    </NestedBlock>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  diagram: Diagram.diagramByIDSelector,
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
