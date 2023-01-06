import React from 'react';

import { SwitchContext } from '../context';

export interface PaneProps {
  value: string | number | boolean;
  children: React.ReactElement | React.ReactElement[];
}

const Pane: React.OldFC<PaneProps> = ({ value, children }) => {
  const activeTab = React.useContext(SwitchContext);

  return activeTab === value ? <>{children}</> : null;
};

export default Pane;
