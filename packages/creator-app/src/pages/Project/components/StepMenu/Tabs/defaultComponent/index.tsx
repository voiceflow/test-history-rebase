import { Flex } from '@voiceflow/ui';
import React from 'react';

import { TabText } from './components';

interface TabUIData<TabType extends string> {
  label: string;
  tabType: TabType;
}

interface TabsProps<TabType extends string> {
  tabs: TabUIData<TabType>[];
  currentTab: TabType;
  onTabChange: (newTabType: TabType) => void;

  /**
   * Controls styling of the Tabs component
   */
  style?: {
    /**
     * Controls gap between tab elements.
     */
    tabGap?: number;
  };
}

const Tabs = <Tab extends string>({ tabs, currentTab, onTabChange, style = {} }: TabsProps<Tab>) => {
  const { tabGap = 16 } = style;

  return (
    <Flex gap={tabGap}>
      {tabs.map(({ label, tabType }) => (
        <TabText key={tabType} isActiveTab={currentTab === tabType} onClick={() => onTabChange(tabType)}>
          {label}
        </TabText>
      ))}
    </Flex>
  );
};

export default Tabs;
