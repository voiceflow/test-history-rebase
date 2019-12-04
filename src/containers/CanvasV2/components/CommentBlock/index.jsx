import React from 'react';
import Textarea from 'react-textarea-autosize';

import User from '@/components/User';
import { EngineContext, useNode, useNodeData } from '@/containers/CanvasV2/contexts';
import * as Realtime from '@/ducks/realtime';
import { useImperativeApi } from '@/hooks';
import { stopImmediatePropagation, stopPropagation, withTargetValue } from '@/utils/dom';

import { Container } from './components';

const CommentBlock = (_, ref) => {
  const { isHighlighted, lockOwner } = useNode();
  const { nodeID, data } = useNodeData();
  const engine = React.useContext(EngineContext);
  const [value, updateValue] = React.useState(data.name);
  const nodeRef = useImperativeApi({ ref });

  React.useEffect(() => {
    updateValue(data.name);
  }, [data.name]);

  const onFocus = React.useCallback(() => engine.realtime.sendUpdate(Realtime.lockNodes([nodeID], [Realtime.LockType.EDIT])), [nodeID]);

  const onBlur = async () => {
    const trimmed = value.trim();

    if (trimmed) {
      await engine.node.updateData(nodeID, { name: trimmed });
      await engine.realtime.sendUpdate(Realtime.unlockNodes([nodeID], [Realtime.LockType.EDIT]));
    } else {
      await engine.node.remove(nodeID);
    }
  };

  return (
    <Container ref={nodeRef} onPaste={stopImmediatePropagation()} isActive={isHighlighted} onDoubleClick={stopPropagation()}>
      <Textarea value={value} disabled={!!lockOwner} onFocus={onFocus} onChange={withTargetValue(updateValue)} onBlur={onBlur} />
      {lockOwner && <User user={lockOwner} />}
    </Container>
  );
};

export default React.forwardRef(CommentBlock);
