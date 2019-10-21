import React from 'react';
import Textarea from 'react-textarea-autosize';

import { EngineContext, useNode } from '@/containers/CanvasV2/contexts';
import { useImperativeApi } from '@/hooks';
import { stopImmediatePropagation, stopPropagation, withTargetValue } from '@/utils/dom';

import { Container } from './components';

const CommentBlock = ({ isActive }, ref) => {
  const { data } = useNode();
  const engine = React.useContext(EngineContext);
  const [value, updateValue] = React.useState(data.name);
  const nodeRef = useImperativeApi({ ref });

  const saveStore = () => {
    const trimmed = value.trim();

    if (trimmed) {
      engine.node.updateData(data.nodeID, { name: trimmed });
    } else {
      engine.node.remove(data.nodeID);
    }
  };

  return (
    <Container isActive={isActive} onDoubleClick={stopPropagation()} onPaste={stopImmediatePropagation()} ref={nodeRef}>
      <Textarea value={value} onChange={withTargetValue(updateValue)} onBlur={saveStore} />
    </Container>
  );
};

export default React.forwardRef(CommentBlock);
