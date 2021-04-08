import React from 'react';

import { PortEntityContext } from '@/pages/Canvas/contexts';

import ConnectorContainer from './PortConnectorContainer';

export type PortConnectorProps = {
  color?: string;
  isConnected?: boolean;
};

const PortConnector: React.FC<PortConnectorProps> = ({ color, isConnected }) => {
  const portEntity = React.useContext(PortEntityContext)!;

  const { link } = portEntity.useState((e) => ({ link: e.resolveLink() }));

  return <ConnectorContainer isConnected={isConnected} color={link?.data?.color ?? color} />;
};

export default PortConnector;
