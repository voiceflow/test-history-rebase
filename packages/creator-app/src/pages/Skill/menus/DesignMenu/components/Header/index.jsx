import React from 'react';

import Tabs from '@/components/Tabs';
import TippyTooltip from '@/components/TippyTooltip';

import { Container, LockIcon, LockIconContainer } from './components';

const Header = ({ tabs, locked, selectedTab, toggleLock, selectActiveTab }) => (
  <Container>
    <Tabs selected={selectedTab} options={tabs} onChange={selectActiveTab} />

    <LockIconContainer>
      <TippyTooltip title={locked ? 'Unlock Sidebar' : 'Lock Sidebar'} position="top" distance={8} hotkey="?">
        <LockIcon size={15} icon={locked ? 'lock' : 'openLock'} locked={locked} onClick={toggleLock} />
      </TippyTooltip>
    </LockIconContainer>
  </Container>
);

export default React.memo(Header);
