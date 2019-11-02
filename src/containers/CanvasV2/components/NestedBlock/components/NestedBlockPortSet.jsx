import React from 'react';

import Port from '@/containers/CanvasV2/components/Port';
import PortList from '@/containers/CanvasV2/components/PortSet/components/PortList';
import PortListItem from '@/containers/CanvasV2/components/PortSet/components/PortListItem';
import { PortIDProvider } from '@/containers/CanvasV2/contexts/PortIDContext';

const NestedBlockPortSet = ({ ports, direction, withLabel, canDrag, canDrop, fullWidth }) => (
  <PortList direction={direction} fullWidth={fullWidth}>
    {ports.map((portID, index) => (
      <PortIDProvider value={portID} key={portID}>
        <PortListItem>
          <Port index={index} withLabel={withLabel} canDrag={canDrag} canDrop={canDrop} />
        </PortListItem>
      </PortIDProvider>
    ))}
  </PortList>
);

export default NestedBlockPortSet;
