import cuid from 'cuid';
import React from 'react';

import Badge from '@/components/Badge';
import { SectionVariant } from '@/components/Section';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { Content, Controls } from '@/pages/Canvas/components/Editor/components';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { EngineContext } from '@/pages/Canvas/contexts';
import { HelpMessage, HelpTooltip } from '@/pages/Canvas/managers/Command/components';

function StartEditor({ nodeID, data, commands }) {
  const engine = React.useContext(EngineContext);

  return (
    <Content
      footer={() => (
        <Controls
          options={[
            {
              label: 'Add Command',
              onClick: () => engine.node.addNested(nodeID, cuid(), BlockType.COMMAND),
            },
          ]}
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
            helpTitle: 'Having trouble?',
            helpMessage: <HelpMessage />,
          }}
          anchor="What are commands?"
        />
      )}
    >
      {commands.length ? (
        commands.map(({ name, nodeID }, index) => (
          <EditorSection
            key={nodeID}
            isLink
            header={name}
            prefix={<Badge>{index + 1}</Badge>}
            onClick={() => engine.focus.set(nodeID)}
            dividers={index !== 0}
          />
        ))
      ) : (
        <EditorSection header="No commands exist in this flow" variant={SectionVariant.secondary} isCollapsed />
      )}
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: Creator.focusedNodeSelector,
  getNodeDataByID: Creator.dataByNodeIDSelector,
};

const mergeProps = ({ focusedNode, getNodeDataByID }) => ({
  commands: focusedNode.combinedNodes.map(getNodeDataByID),
});

export default connect(mapStateToProps, null, mergeProps)(StartEditor);
