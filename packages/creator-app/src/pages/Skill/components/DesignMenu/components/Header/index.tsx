import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Tabs from '@/components/Tabs';
import { Identifier } from '@/styles/constants';

import { Tab, TabItem } from '../../constants';
import { Container, LockIcon, LockIconContainer } from './components';

interface HeaderProps {
  tabs: TabItem[];
  locked?: boolean;
  toggleLock: VoidFunction;
  selectedTab: Tab;
  selectActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ tabs, locked, selectedTab, toggleLock, selectActiveTab }) => (
  <Container>
    <Tabs selected={selectedTab} options={tabs} onChange={selectActiveTab} />

    <LockIconContainer id={Identifier.STEP_MENU_LOCK_BUTTON}>
      <TippyTooltip title={locked ? 'Unlock Sidebar' : 'Lock Sidebar'} position="top" distance={8} hotkey="?">
        <LockIcon size={15} icon={locked ? 'lock' : 'openLock'} locked={locked} onClick={toggleLock} />
      </TippyTooltip>
    </LockIconContainer>
  </Container>
);

export default React.memo(Header);
