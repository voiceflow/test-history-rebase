import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { Content } from '@/pages/Canvas/components/Editor';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';

function CombinedEditor({ nestedBlocks }) {
  const engine = React.useContext(EngineContext);
  const getManager = React.useContext(ManagerContext);

  return (
    <Content>
      {nestedBlocks.map(({ nodeID, ...data }, index) => {
        const { getIcon, getIconColor, icon, iconColor, label } = getManager(data.type);

        return (
          <Section
            key={nodeID}
            prefix={<SvgIcon icon={getIcon?.(data) || icon} color={getIconColor?.(data) || iconColor} />}
            header={data.name || label}
            isLink
            onClick={() => engine.focus.set(nodeID)}
            isDividerNested={index !== 0}
            headerVariant={HeaderVariant.LINK}
          />
        );
      })}
    </Content>
  );
}

const mapStateToProps = {
  dataSelector: Creator.dataByNodeIDSelector,
  nodeSelector: Creator.nodeByIDSelector,
};

const mergeProps = ({ dataSelector, nodeSelector }, _, { data }) => {
  const { nodeID } = data;
  const { combinedNodes } = nodeSelector(nodeID);

  return {
    nestedBlocks: combinedNodes.map((nodeID) => dataSelector(nodeID)),
  };
};

export default connect(mapStateToProps, null, mergeProps)(CombinedEditor);
