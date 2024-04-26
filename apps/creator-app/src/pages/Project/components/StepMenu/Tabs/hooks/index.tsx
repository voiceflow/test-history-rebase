import React from 'react';

interface useTabsProps<TabType extends string, TabData> {
  tabToDataMap: Record<TabType, TabData[]>;
  defaultTab: TabType;
}

interface useTabsOutput<TabType, TabData> {
  currentTabData: TabData[];
  currentTab: TabType;
  setCurrentTab: (newTab: TabType) => void;
}

const useTabs = <TabType extends string, TabData>({
  tabToDataMap,
  defaultTab,
}: useTabsProps<TabType, TabData>): useTabsOutput<TabType, TabData> => {
  const [currentTab, setCurrentTab] = React.useState<TabType>(defaultTab);

  return {
    currentTabData: tabToDataMap[currentTab],
    currentTab,
    setCurrentTab,
  };
};

export default useTabs;
