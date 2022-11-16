import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';

import * as S from '../styles';
import TabButton from './TabButton';

interface TeamHeaderProps {
  onSwitchTab: (text: string) => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ onSwitchTab }) => {
  const [canManageBilling] = usePermission(Permission.MANAGE_BILLING);

  const [selectedTab, setSelectedTab] = React.useState('Members');

  const switchTab = (tab: string) => {
    if (selectedTab !== tab) {
      setSelectedTab(tab);
      onSwitchTab(tab);
    }
  };

  return (
    <S.HeaderContainer style={{ paddingLeft: '16px', justifyContent: 'flex-start' }}>
      <TabButton title="Members" onClick={() => switchTab('Members')} active={selectedTab === 'Members'} />
      {canManageBilling && <TabButton title="Billing" onClick={() => switchTab('Billing')} active={selectedTab === 'Billing'} />}
    </S.HeaderContainer>
  );
};

export default TeamHeader;
