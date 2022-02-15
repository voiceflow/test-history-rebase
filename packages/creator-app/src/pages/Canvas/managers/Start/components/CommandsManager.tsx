import { Badge, Text } from '@voiceflow/ui';
import React from 'react';

import { SectionVariant } from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { EngineContext } from '@/pages/Canvas/contexts';

interface CommandsManagerProps {
  nodeID: string;
}

const CommandsManager: React.FC<CommandsManagerProps> = ({ nodeID }) => {
  const commands = useSelector(CreatorV2.stepDataByBlockIDSelector, { id: nodeID });

  const engine = React.useContext(EngineContext);

  return (
    <Content footer={() => <Controls options={[{ label: 'Add Command', onClick: () => engine?.node.appendStep(nodeID, BlockType.COMMAND) }]} />}>
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
        <EditorSection header={<Text fontWeight="normal">No commands exist in this flow</Text>} variant={SectionVariant.SECONDARY} />
      )}
    </Content>
  );
};

export default CommandsManager;
