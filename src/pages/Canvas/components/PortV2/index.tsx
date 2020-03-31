import React from 'react';

import { usePort } from '@/pages/Canvas/contexts';

import { Container, Link, LinkPath } from './components';
import { LINK_WIDTH } from './constants';
import { useLinkTerminal, usePortAPI, usePortSubscription } from './hooks';

export type PortV2Props = {
  color?: string;
};

const PortV2: React.FC<PortV2Props> = ({ color }) => {
  const portRef = React.useRef<HTMLDivElement | null>(null);
  const { portID, hasActiveLinks } = usePort();
  const { onStart: onStartLink } = useLinkTerminal(portID);
  const api = usePortAPI(portRef);

  const linkProps = { isNewStyle: true, ...(api.isHighlighted && { strokeColor: '#2c85ff' }) };

  usePortSubscription(portID, api);

  return (
    <>
      <Container
        onMouseDown={onStartLink}
        onClick={onStartLink}
        color={color}
        isHighlighted={api.isHighlighted}
        isConnected={hasActiveLinks}
        ref={portRef}
      />
      {(api.isHighlighted || hasActiveLinks) && (
        <Link>
          <LinkPath d={`M 0 4 L ${LINK_WIDTH} 4`} {...linkProps} />
        </Link>
      )}
    </>
  );
};

export default PortV2;
