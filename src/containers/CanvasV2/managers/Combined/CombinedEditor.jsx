import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Section from '@/componentsV2/Section';
import { Content } from '@/containers/CanvasV2/components/Editor';
import { getBlockCategory } from '@/containers/CanvasV2/constants';
import { EngineContext, ManagerContext } from '@/containers/CanvasV2/contexts';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';

function CombinedEditor({ nestedBlocks }) {
  const engine = React.useContext(EngineContext);
  const getManager = React.useContext(ManagerContext);

  return (
    <Content>
      {nestedBlocks.map(({ type, nodeID, name }) => (
        <Section
          key={nodeID}
          prefix={<SvgIcon icon={getManager(type)?.icon} color={getBlockCategory(type)?.color} />}
          header={name}
          isLink
          onClick={() => engine.focus.set(nodeID)}
          isDividerNested
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

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(CombinedEditor);
