import React from 'react';

import Port from '@/containers/CanvasV2/components/Port';
import { PortIDProvider } from '@/containers/CanvasV2/contexts';

import { Container, PortList, PortListItem } from './components';
import { usePortFilter } from './hooks';

function PortSet({ ports, children }) {
  const portFilter = usePortFilter();

  return (
    <Container>
      <PortList>
        {ports.in.map((portID, index) => (
          <PortIDProvider value={portID} key={portID}>
            <PortListItem>
              <Port canDrop index={index} />
            </PortListItem>
          </PortIDProvider>
        ))}
      </PortList>
      {children}
      <PortList direction="out">
        {/* eslint-disable-next-line sonarjs/no-identical-functions */}
        {ports.out.filter(portFilter).map((portID, index) => (
          <PortIDProvider value={portID} key={portID}>
            <PortListItem>
              <Port canDrag withLabel index={index} />
            </PortListItem>
          </PortIDProvider>
        ))}
      </PortList>
    </Container>
  );
}

export default React.memo(PortSet);
