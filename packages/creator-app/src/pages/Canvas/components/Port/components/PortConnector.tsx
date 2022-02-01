import React from 'react';

import ConnectorContainer from './PortConnectorContainer';

export interface PortConnectorProps {
  isConnected?: boolean;
}

const PortConnector: React.FC<PortConnectorProps> = ({ isConnected }) => {
  return <ConnectorContainer isConnected={isConnected} />;
};

export default PortConnector;
