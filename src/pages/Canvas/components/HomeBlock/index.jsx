import cuid from 'cuid';
import React from 'react';

import { FlexCenter } from '@/componentsV2/Flex';
import { BlockType } from '@/constants';
import { useImperativeApi } from '@/hooks';
import AddButton from '@/pages/Canvas/components/AddButton';
import GroupBlock, { Section as GroupBlockSection } from '@/pages/Canvas/components/GroupBlock';
import * as NestedBlock from '@/pages/Canvas/components/NestedBlock';
import PortLabel from '@/pages/Canvas/components/Port/components/PortLabel';
import { EditPermissionContext, EngineContext, NodeIDProvider, useNode } from '@/pages/Canvas/contexts';

import CommandBlock from './components/CommandBlock';

const HomeBlock = (_, ref) => {
  const { node, isHighlighted } = useNode();
  const engine = React.useContext(EngineContext);
  const { canEdit } = React.useContext(EditPermissionContext);
  const nodeRef = useImperativeApi({ ref, nodeWithApi: true });

  const onAddCommand = async () => {
    const newBlockID = cuid();

    await engine.node.addNested(node.id, newBlockID, BlockType.COMMAND);
  };

  return (
    <GroupBlock isActive={isHighlighted} addButton={canEdit && <AddButton onClick={onAddCommand} tooltip="Add Command" />} ref={nodeRef}>
      <GroupBlockSection label="Home" icon="home" tooltip="This is where your project begins">
        <NestedBlock.Container>
          <FlexCenter fullWidth>
            <PortLabel>Start</PortLabel>
            <NestedBlock.PortSet ports={node.ports.out} direction="out" canDrag />
          </FlexCenter>
        </NestedBlock.Container>
      </GroupBlockSection>
      {!!node.combinedNodes.length && (
        <GroupBlockSection
          style={{ marginTop: '2px' }}
          label="Commands"
          icon="flows"
          tooltip="Commands can be accessed by the user from anywhere in your skill. For example, if a user says “Alexa, help” while in your skill, they will activate the help flow. Once a user is done the help flow they will be returned to the wherever they previously were in the project."
        >
          {node.combinedNodes.map((nodeID) => (
            <NodeIDProvider value={nodeID} key={nodeID}>
              <CommandBlock />
            </NodeIDProvider>
          ))}
        </GroupBlockSection>
      )}
    </GroupBlock>
  );
};

export default React.forwardRef(HomeBlock);
