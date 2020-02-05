import React from 'react';

import Port from '@/containers/CanvasV2/components/Port';
import PortList from '@/containers/CanvasV2/components/PortSet/components/PortList';
import PortListItem from '@/containers/CanvasV2/components/PortSet/components/PortListItem';
import { usePortFilter } from '@/containers/CanvasV2/components/PortSet/hooks';
import { PortIDProvider } from '@/containers/CanvasV2/contexts/PortIDContext';

const NestedBlockPortSet = ({ ports, direction, withLabel, canDrag, canDrop, fullWidth }) => {
  const portFilter = usePortFilter();

  return (
    <PortList direction={direction} fullWidth={fullWidth}>
      {ports.filter(portFilter).map((portID, index) => (
        <PortIDProvider value={portID} key={portID}>
          <PortListItem>
            <Port index={index} withLabel={withLabel} canDrag={canDrag} canDrop={canDrop} />
          </PortListItem>
        </PortIDProvider>
      ))}
    </PortList>
  );
};

export default NestedBlockPortSet;
