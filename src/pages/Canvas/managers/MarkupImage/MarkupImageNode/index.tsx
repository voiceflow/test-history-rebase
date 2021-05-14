import React from 'react';

import { Markup } from '@/models';
import { useBlockAPI } from '@/pages/Canvas/components/Block/hooks';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import { Container } from './components';

const MarkupImageNode: React.FC<ConnectedMarkupNodeProps<Markup.NodeData.Image>> = React.forwardRef(({ data }, ref) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const { isFocused, isActivated } = nodeEntity.useState((e) => ({
    isFocused: e.isFocused,
    isActivated: e.isActive,
  }));

  React.useEffect(() => {
    if (isFocused) {
      engine.transformation.initialize(nodeEntity.nodeID);
    }
  }, [isFocused]);

  const blockAPI = useBlockAPI();

  React.useImperativeHandle(ref, () => blockAPI, [blockAPI]);

  return <Container activated={isActivated} ref={blockAPI.ref} url={data.url} width={data.width} height={data.height} />;
});

export default MarkupImageNode;
