import React from 'react';

import { PortEntityContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { PORT_HIGHLIGHTED_CLASSNAME } from '../../constants';
import { Container, Lifecycle, Link, LinkPath } from './components';
import { LINK_WIDTH } from './constants';
import { useHandlers, usePortInstance } from './hooks';

export type PortProps = {
  color?: string;
};

const Port: React.FC<PortProps> = ({ color }) => {
  const portEntity = React.useContext(PortEntityContext)!;
  const instance = usePortInstance<HTMLDivElement>();
  const { isHighlighted, isConnected } = portEntity.useState((e) => ({
    isHighlighted: e.isHighlighted,
    isConnected: e.isConnected,
  }));
  const { onMouseDown, onMouseUp } = useHandlers();

  portEntity.useInstance(instance);

  portEntity.useConditionalStyle(PORT_HIGHLIGHTED_CLASSNAME, isHighlighted);

  return (
    <>
      <Lifecycle />
      <Container
        className={ClassName.CANVAS_PORT}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        color={color}
        isConnected={isConnected}
        ref={instance.ref}
      />
      {(isHighlighted || isConnected) && (
        <Link>
          <LinkPath isHighlighted={isHighlighted} d={`M 0 4 L ${LINK_WIDTH} 4`} />
        </Link>
      )}
    </>
  );
};

export default React.memo(Port);
