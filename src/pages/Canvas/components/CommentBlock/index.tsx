import React from 'react';
import Textarea from 'react-textarea-autosize';

import User from '@/components/User';
import * as Realtime from '@/ducks/realtime';
import { compose } from '@/hocs';
import { useLinkedState } from '@/hooks';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { BlockAPI } from '@/pages/Canvas/types';
import { stopImmediatePropagation, stopPropagation, withTargetValue } from '@/utils/dom';

import { Container } from './components';
import { useCommentBlockAPI } from './hooks';

const CommentBlock: React.RefForwardingComponent<BlockAPI> = (_, ref) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const engine = React.useContext(EngineContext)!;
  const { name, lockOwner } = nodeEntity.useState((e) => ({
    name: e.resolve().data.name,
    lockOwner: e.lockOwner,
  }));
  const [value, updateValue] = useLinkedState(name);
  const blockAPI = useCommentBlockAPI<HTMLDivElement>();

  React.useImperativeHandle(ref, () => blockAPI, [blockAPI]);

  const onFocus = React.useCallback(() => engine.realtime.sendUpdate(Realtime.lockNodes([nodeEntity.nodeID], [Realtime.LockType.EDIT])), []);

  const onBlur = React.useCallback(async () => {
    const trimmed = value.trim();

    if (trimmed) {
      await engine.node.updateData(nodeEntity.nodeID, { name: trimmed });
      await engine.realtime.sendUpdate(Realtime.unlockNodes([nodeEntity.nodeID], [Realtime.LockType.EDIT]));
    } else {
      await engine.node.remove(nodeEntity.nodeID);
    }
  }, [value]);

  return (
    <Container ref={blockAPI.ref} onPaste={stopImmediatePropagation()} onDoubleClick={stopPropagation()}>
      <Textarea value={value} disabled={!!lockOwner} onFocus={onFocus} onChange={withTargetValue(updateValue)} onBlur={onBlur} />
      {lockOwner && <User user={lockOwner} />}
    </Container>
  );
};

export default compose(React.memo, React.forwardRef)(CommentBlock);
