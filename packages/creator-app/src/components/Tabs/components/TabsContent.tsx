import React, { createContext } from 'react';

export const TabsContext = createContext<string>('');

interface TabsContentProps {
  selected: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ children, selected }) => <TabsContext.Provider value={selected}>{children}</TabsContext.Provider>;

export default TabsContent;
