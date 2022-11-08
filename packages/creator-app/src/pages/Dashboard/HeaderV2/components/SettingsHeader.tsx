import React from 'react';

import { HeaderContainer } from '../styles';
import TabButton from './TabButton';

interface SettingsHeaderProps {
  onSwitchTab: (text: string) => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onSwitchTab }) => {
  const [selectedTab, setSelectedTab] = React.useState('General');

  const switchTab = (tab: string) => {
    if (selectedTab !== tab) {
      setSelectedTab(tab);
      onSwitchTab(tab);
    }
  };

  return (
    <HeaderContainer style={{ paddingLeft: '16px', justifyContent: 'flex-start' }}>
      <TabButton title="General" onClick={() => switchTab('General')} active={selectedTab === 'General'} />
      <TabButton title="Developer" onClick={() => switchTab('Developer')} active={selectedTab === 'Developer'} />
    </HeaderContainer>
  );
};

export default SettingsHeader;
