import React from 'react';

import { EngineContext, usePort } from '@/pages/Canvas/contexts';

import { Container } from './components';
import { useLinkTerminal } from './hooks';

const PortV2 = ({ color }) => {
  const portRef = React.useRef();
  const engine = React.useContext(EngineContext);
  const { portID, hasActiveLinks } = usePort();
  const [onStartLink] = useLinkTerminal(portID);

  const api = React.useMemo(
    () => ({
      getRect: () => portRef.current.getBoundingClientRect(),
    }),
    []
  );

  React.useEffect(() => {
    engine.registerPort(portID, api);

    return () => engine.expirePort(portID, api);
  }, []);

  return <Container onMouseDown={onStartLink} onClick={onStartLink} color={color} isConnected={hasActiveLinks} ref={portRef} />;
};

export default PortV2;
