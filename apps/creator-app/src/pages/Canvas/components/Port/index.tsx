import React from 'react';

import { HSLShades } from '@/constants';
import { PORT_HIGHLIGHTED_CLASSNAME, PORT_PROTOTYPE_END_UNLINKED_CLASSNAME } from '@/pages/Canvas/constants';
import { PortEntityContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { Actions, Connector, Container, ImageContainer, Lifecycle, Link } from './components';
import { useHandlers, usePortInstance } from './hooks';

interface PortProps {
  flat?: boolean;
  isChip?: boolean;
  palette?: HSLShades;
  withoutLink?: boolean;
  parentActionsPath?: string;
  parentActionsParams?: Record<string, string>;
}

const Port: React.FC<PortProps> = ({ flat, isChip, palette, withoutLink, parentActionsPath, parentActionsParams }) => {
  const portEntity = React.useContext(PortEntityContext)!;
  const instance = usePortInstance<HTMLDivElement>();
  const { isConnected, isHighlighted, isConnectedToActions, isLinkCreationHighlighted, isFinalPrototypeUnlinkedPort } = portEntity.useState((e) => ({
    isConnected: e.isConnected,
    isHighlighted: e.isHighlighted || e.isPrototypeHighlighted || e.isLinkCreationHighlighted,
    isConnectedToActions: e.isConnectedToActions,
    isFinalPrototypeUnlinkedPort: e.isFinalPrototypeUnlinkedPort,
    isLinkCreationHighlighted: e.isLinkCreationHighlighted,
  }));
  const { onMouseDown, onMouseUp } = useHandlers({ parentActionsPath, parentActionsParams });

  portEntity.useInstance(instance);

  portEntity.useConditionalStyle(PORT_HIGHLIGHTED_CLASSNAME, isHighlighted);
  portEntity.useConditionalStyle(PORT_PROTOTYPE_END_UNLINKED_CLASSNAME, isFinalPrototypeUnlinkedPort);

  const { linkID } = portEntity;

  return (
    <>
      <Lifecycle />

      <Container
        ref={instance.ref}
        className={ClassName.CANVAS_PORT}
        onMouseUp={isConnectedToActions ? undefined : onMouseUp}
        onMouseDown={isConnectedToActions ? undefined : onMouseDown}
        isConnectedToActions={isConnectedToActions}
      >
        <Connector flat={flat} chip={isChip} palette={palette} connected={isConnected} />
      </Container>

      {isConnectedToActions ? (
        <Actions key={linkID} isChip={isChip} parentPath={parentActionsPath} parentParams={parentActionsParams} />
      ) : (
        !withoutLink &&
        (isHighlighted || isConnected) && <Link key={linkID} linkID={linkID} isNew={isLinkCreationHighlighted} isHighlighted={isHighlighted} />
      )}
    </>
  );
};

export default Object.assign(React.memo(Port), { ImageContainer });
