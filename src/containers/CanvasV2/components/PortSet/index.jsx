import React from 'react';

import Port from '@/containers/CanvasV2/components/Port';
import { EngineContext, PlatformContext, PortIDProvider } from '@/containers/CanvasV2/contexts';

import { Container, PortList, PortListItem } from './components';

function PortSet({ ports, children }) {
  const engine = React.useContext(EngineContext);
  const platform = React.useContext(PlatformContext);

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
        {ports.out
          .filter((portID) => {
            const port = engine.getPortByID(portID);

            return port && (!port.platform || port.platform === platform);
          })
          .map((portID, index) => (
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
