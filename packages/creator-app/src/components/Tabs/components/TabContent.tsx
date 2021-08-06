import React, { createContext } from 'react';

export const TabsContext = createContext<string>('');

interface TabContentProps {
  activeTab: string;
  children: React.ReactElement[];
}

const TabContent: React.FC<TabContentProps> = ({ children, activeTab }): React.ReactElement => (
  <div>
    <TabsContext.Provider value={activeTab}>{children}</TabsContext.Provider>
  </div>
);

export default TabContent;
