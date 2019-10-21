import React from 'react';

import Port from '@/containers/CanvasV2/components/Port';
import { EngineContext, PlatformContext } from '@/containers/CanvasV2/contexts';

import { Container, PortList, PortListItem } from './components';

function PortSet({ ports, children }) {
  const engine = React.useContext(EngineContext);
  const platform = React.useContext(PlatformContext);

  return (
    <Container>
      <PortList>
        {ports.in.map((portID, index) => (
          <PortListItem key={portID}>
            <Port canDrop portID={portID} index={index} />
          </PortListItem>
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
            <PortListItem key={portID}>
              <Port canDrag withLabel portID={portID} index={index} />
            </PortListItem>
          ))}
      </PortList>
    </Container>
  );
}

export default React.memo(PortSet);
