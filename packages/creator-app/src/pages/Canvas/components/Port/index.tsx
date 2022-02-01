import React from 'react';

import { PORT_HIGHLIGHTED_CLASSNAME, PORT_PROTOTYPE_END_UNLINKED_CLASSNAME } from '@/pages/Canvas/constants';
import { PortEntityContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { Connector, Container, Lifecycle, Link } from './components';
import { useHandlers, usePortInstance } from './hooks';

const Port: React.FC = () => {
  const portEntity = React.useContext(PortEntityContext)!;
  const instance = usePortInstance<HTMLDivElement>();
  const { isConnected, isHighlighted, isFinalPrototypeUnlinkedPort } = portEntity.useState((e) => ({
    isFinalPrototypeUnlinkedPort: e.isFinalPrototypeUnlinkedPort,
    isConnected: e.isConnected,
    isHighlighted: e.isHighlighted || e.isPrototypeHighlighted,
  }));
  const { onMouseDown, onMouseUp } = useHandlers();

  portEntity.useInstance(instance);

  portEntity.useConditionalStyle(PORT_HIGHLIGHTED_CLASSNAME, isHighlighted);
  portEntity.useConditionalStyle(PORT_PROTOTYPE_END_UNLINKED_CLASSNAME, isFinalPrototypeUnlinkedPort);
  return (
    <>
      <Lifecycle />

      <Container ref={instance.ref} className={ClassName.CANVAS_PORT} onMouseUp={onMouseUp} onMouseDown={onMouseDown}>
        <Connector isConnected={isConnected} />
      </Container>

      {(isHighlighted || isConnected) && <Link key={portEntity.linkID} linkID={portEntity.linkID} isHighlighted={isHighlighted} />}
    </>
  );
};

export default React.memo(Port);
