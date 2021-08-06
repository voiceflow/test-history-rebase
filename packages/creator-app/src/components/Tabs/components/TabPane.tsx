import classnames from 'classnames';
import React, { useContext } from 'react';

import { styled } from '@/hocs';

import { TabsContext } from './TabContent';

const TabPaneWrapper = styled.div`
  display: none;
  &.active {
    display: block;
  }
`;

interface TabPaneProps {
  tabId: string;
  children: React.ReactElement | React.ReactElement[];
}

const TabPane: React.FC<TabPaneProps> = ({ children, tabId }): React.ReactElement => {
  const activeTab = useContext(TabsContext);
  return <TabPaneWrapper className={classnames({ active: activeTab === tabId })}>{children}</TabPaneWrapper>;
};

export default TabPane;
