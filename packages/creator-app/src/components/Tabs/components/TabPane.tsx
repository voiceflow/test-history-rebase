import React from 'react';

import { TabsContext } from './TabsContent';

interface TabPaneProps {
  tabID: string;
  children: React.ReactElement | React.ReactElement[];
}

const TabPane: React.FC<TabPaneProps> = ({ tabID, children }) => {
  const activeTab = React.useContext(TabsContext);

  return <>{activeTab === tabID ? children : null}</>;
};

export default TabPane;
