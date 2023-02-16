import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useBlockAPI } from '@/pages/Canvas/components/Block/hooks';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import * as S from './styles';

const MarkupVideoNode: React.FC<ConnectedMarkupNodeProps<Realtime.Markup.NodeData.Video>> = React.forwardRef(({ data }, ref) => {
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

  return (
    <S.Container activated={isActivated} ref={blockAPI.ref} width={data.width} height={data.height}>
      <S.Video src={data.url} controls />
    </S.Container>
  );
});

export default MarkupVideoNode;
