import React from 'react';

import Port from '@/containers/CanvasV2/components/Port';
import PortList from '@/containers/CanvasV2/components/PortSet/components/PortList';
import PortListItem from '@/containers/CanvasV2/components/PortSet/components/PortListItem';

const NestedBlockPortSet = ({ ports, direction, withLabel, canDrag, canDrop, fullWidth }) => (
  <PortList direction={direction} fullWidth={fullWidth}>
    {ports.map((portID, index) => (
      <PortListItem key={portID}>
        <Port portID={portID} index={index} withLabel={withLabel} canDrag={canDrag} canDrop={canDrop} />
      </PortListItem>
    ))}
  </PortList>
);

export default NestedBlockPortSet;
