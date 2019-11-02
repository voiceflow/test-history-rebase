import React from 'react';
import Textarea from 'react-textarea-autosize';

import { EngineContext, useNode, useNodeData } from '@/containers/CanvasV2/contexts';
import { useImperativeApi } from '@/hooks';
import { stopImmediatePropagation, stopPropagation, withTargetValue } from '@/utils/dom';

import { Container } from './components';

const CommentBlock = (_, ref) => {
  const { isHighlighted } = useNode();
  const { nodeID, data } = useNodeData();
  const engine = React.useContext(EngineContext);
  const [value, updateValue] = React.useState(data.name);
  const nodeRef = useImperativeApi({ ref });

  const saveStore = () => {
    const trimmed = value.trim();

    if (trimmed) {
      engine.node.updateData(nodeID, { name: trimmed });
    } else {
      engine.node.remove(nodeID);
    }
  };

  return (
    <Container isActive={isHighlighted} onDoubleClick={stopPropagation()} onPaste={stopImmediatePropagation()} ref={nodeRef}>
      <Textarea value={value} onChange={withTargetValue(updateValue)} onBlur={saveStore} />
    </Container>
  );
};

export default React.forwardRef(CommentBlock);
