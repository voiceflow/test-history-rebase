import React from 'react';

import { PORT_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';
import { PortEntityContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { Connector, Container, Lifecycle, Link } from './components';
import { useHandlers, usePortInstance } from './hooks';

export type PortProps = {
  color?: string;
};

const Port: React.FC<PortProps> = ({ color }) => {
  const portEntity = React.useContext(PortEntityContext)!;
  const instance = usePortInstance<HTMLDivElement>();
  const { isConnected, isHighlighted } = portEntity.useState((e) => ({
    isConnected: e.isConnected,
    isHighlighted: e.isHighlighted || e.isPrototypeHighlighted,
  }));
  const { onMouseDown, onMouseUp } = useHandlers();

  portEntity.useInstance(instance);

  portEntity.useConditionalStyle(PORT_HIGHLIGHTED_CLASSNAME, isHighlighted);

  return (
    <>
      <Lifecycle />

      <Container ref={instance.ref} className={ClassName.CANVAS_PORT} onMouseUp={onMouseUp} onMouseDown={onMouseDown}>
        <Connector color={color} isConnected={isConnected} />
      </Container>

      {(isHighlighted || isConnected) && <Link key={portEntity.linkID} linkID={portEntity.linkID} isHighlighted={isHighlighted} />}
    </>
  );
};

export default React.memo(Port);
