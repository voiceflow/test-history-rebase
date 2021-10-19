import { Badge } from '@voiceflow/ui';
import React from 'react';

import { SectionVariant } from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { EngineContext } from '@/pages/Canvas/contexts';

interface CommandsManagerProps {
  nodeID: string;
}

const CommandsManager: React.FC<CommandsManagerProps> = ({ nodeID }) => {
  const focusedNode = useSelector(Creator.focusedNodeSelector);
  const getNodeDataByID = useSelector(Creator.dataByNodeIDSelector);

  const commands = React.useMemo(() => focusedNode?.combinedNodes.map(getNodeDataByID) ?? [], [focusedNode, getNodeDataByID]);

  const engine = React.useContext(EngineContext);

  return (
    <Content footer={() => <Controls options={[{ label: 'Add Command', onClick: () => engine?.node.addNested(nodeID, BlockType.COMMAND) }]} />}>
      {commands.length ? (
        commands.map(({ name, nodeID }, index) => (
          <EditorSection
            key={nodeID}
            isLink
            header={name}
            prefix={<Badge>{index + 1}</Badge>}
            onClick={() => engine?.focus.set(nodeID)}
            dividers={index !== 0}
            headerVariant={HeaderVariant.LINK}
          />
        ))
      ) : (
        <EditorSection header="No commands exist in this flow" variant={SectionVariant.SECONDARY} />
      )}
    </Content>
  );
};

export default CommandsManager;
