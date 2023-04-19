import { Canvas, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Port from '@/pages/Canvas/components/Port';
import { EngineContext, PortEntityContext, PortEntityProvider } from '@/pages/Canvas/contexts';

import { ActionsPortAPIContext, StepAPIContext } from '../contexts';

interface ActionPortProps {
  portID?: string | null;
}

const ActionPort: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const portAPI = React.useContext(ActionsPortAPIContext)!;
  const portEntity = React.useContext(PortEntityContext)!;

  const { linkID, isHighlighted } = portEntity.useState((e) => ({
    linkID: e.linkID ?? engine.linkCreation.sourcePortID,
    isHighlighted: e.isHighlighted || e.isPrototypeHighlighted || e.isLinkCreationHighlighted,
  }));

  React.useEffect(() => {
    if (!linkID) return undefined;

    engine.registerPortLinkInstance(linkID, portAPI);

    return () => {
      engine.expirePortLinkInstance(linkID);
    };
  }, [linkID, portAPI]);

  return (
    <>
      <Canvas.Action.Separator />

      <Canvas.Action.Port active={isHighlighted} onMouseUp={stopPropagation(null, true)}>
        <Port withoutLink parentActionsPath={portAPI.parentPath} parentActionsParams={portAPI.parentParams} />
      </Canvas.Action.Port>
    </>
  );
};

const ActionPortContainer: React.FC<ActionPortProps> = ({ portID }) => {
  const stepAPI = React.useContext(StepAPIContext);

  if (!stepAPI?.withPorts || !portID) return null;

  return (
    <PortEntityProvider id={portID}>
      <ActionPort />
    </PortEntityProvider>
  );
};

export default ActionPortContainer;
