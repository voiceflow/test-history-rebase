import React from 'react';

import { usePort } from '@/pages/Canvas/contexts';

import { Container } from './components';
import { useLinkTerminal, usePortAPI, usePortSubscription } from './hooks';

export type PortV2Props = {
  color?: string;
};

const PortV2: React.FC<PortV2Props> = ({ color }) => {
  const portRef = React.useRef<HTMLDivElement | null>(null);
  const { portID, hasActiveLinks } = usePort();
  const { onStart: onStartLink } = useLinkTerminal(portID);
  const [isHighlighted, api] = usePortAPI(portRef);

  usePortSubscription(portID, api);

  return (
    <Container
      onMouseDown={onStartLink}
      onClick={onStartLink}
      color={color}
      isHighlighted={isHighlighted}
      isConnected={hasActiveLinks}
      ref={portRef}
    />
  );
};

export default PortV2;
