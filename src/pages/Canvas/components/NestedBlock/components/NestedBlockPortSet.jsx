import React from 'react';

import Port from '@/pages/Canvas/components/Port';
import PortList from '@/pages/Canvas/components/PortSet/components/PortList';
import PortListItem from '@/pages/Canvas/components/PortSet/components/PortListItem';
import { usePortFilter } from '@/pages/Canvas/components/PortSet/hooks';
import { PortIDProvider } from '@/pages/Canvas/contexts/PortIDContext';

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
