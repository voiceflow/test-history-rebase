import React from 'react';

import Section from '@/components/Section';
import SvgIcon from '@/components/SvgIcon';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { Content } from '@/pages/Canvas/components/Editor';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';

function CombinedEditor({ nestedBlocks }) {
  const engine = React.useContext(EngineContext);
  const getManager = React.useContext(ManagerContext);

  return (
    <Content>
      {nestedBlocks.map(({ type, nodeID, name }, index) => (
        <Section
          key={nodeID}
          prefix={<SvgIcon icon={getManager(type)?.icon} color={getManager(type)?.iconColor} />}
          header={name}
          isLink
          onClick={() => engine.focus.set(nodeID)}
          isDividerNested={index !== 0}
        />
      ))}
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
