import React from 'react';

import { getInvocationNodeID } from '@/client/adapters/creator/utils';
import { SectionVariant } from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import { BlockType, PLATFORM_META } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { EngineContext } from '@/pages/Canvas/contexts';
import { HelpMessage, HelpTooltip } from '@/pages/Canvas/managers/Command/components';

function StartEditor({ nodeID, data, commands, isRootDiagram, platform }) {
  const engine = React.useContext(EngineContext);

  return (
    <Content
      footer={() => (
        <Controls
          options={[
            {
              label: 'Add Command',
              onClick: () => engine.node.addNested(nodeID, BlockType.COMMAND),
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
      {isRootDiagram && (
        <EditorSection
          isLink
          header="Invocation"
          prefix={PLATFORM_META[platform].icon}
          onClick={() => engine.focus.set(getInvocationNodeID(nodeID))}
        />
      )}

      {commands.length ? (
        commands.map(({ name, nodeID }, index) => (
          <EditorSection
            key={nodeID}
            isLink
            header={name}
            prefix={<SvgIcon icon="flow" color="#3c6997" />}
            onClick={() => engine.focus.set(nodeID)}
            dividers={index !== 0 || isRootDiagram}
          />
        ))
      ) : (
        <EditorSection header="No commands exist in this flow" variant={SectionVariant.SECONDARY} isCollapsed />
      )}
    </Content>
  );
}

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  focusedNode: Creator.focusedNodeSelector,
  isRootDiagram: Skill.isRootDiagramSelector,
  getNodeDataByID: Creator.dataByNodeIDSelector,
};

const mergeProps = ({ focusedNode, getNodeDataByID }) => ({
  commands: focusedNode.combinedNodes.map(getNodeDataByID),
});

export default connect(mapStateToProps, null, mergeProps)(StartEditor);
