import React from 'react';
import styled from 'styled-components';

export const DropdownContainer = styled.div`
  width: 240px;
`;

export const PortalContainer = ({ children }) => {
  const [portalNode, updatePortalNde] = React.useState(null);

  return <div ref={(node) => updatePortalNde(node)}>{portalNode && children({ portalNode })}</div>;
};
