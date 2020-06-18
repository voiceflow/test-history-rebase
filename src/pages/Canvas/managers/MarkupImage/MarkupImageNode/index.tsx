import React from 'react';

import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import { Container } from './components';

const MarkupImageNode: React.FC<ConnectedMarkupNodeProps<Markup.NodeData.Image>> = ({ data }) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { isFocused } = nodeEntity.useState((e) => ({
    isFocused: e.isFocused,
  }));

  React.useEffect(() => {
    if (isFocused) {
      engine.transformation.initialize(nodeEntity.nodeID);
    }
  }, [isFocused]);

  return <Container url={data.url} width={data.width} height={data.height} />;
};

export default MarkupImageNode;
