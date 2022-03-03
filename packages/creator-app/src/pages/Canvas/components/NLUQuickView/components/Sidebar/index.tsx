import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';

import { Container, NLUButton, SearchInput } from './components';
import EntitiesSection from './components/EntitiesSection';
import IntentSection from './components/IntentSection';
import VariablesSection from './components/VariablesSection';

interface SidebarProps {
  setActiveTab: (tab: InteractionModelTabType) => void;
  activeTab: InteractionModelTabType;
}

const SearchPlaceholders = {
  [InteractionModelTabType.INTENTS]: 'intents',
  [InteractionModelTabType.SLOTS]: 'slots',
  [InteractionModelTabType.VARIABLES]: 'variables',
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [search, setSearch] = React.useState('');

  return (
    <Container>
      <Box>
        <SearchInput
          placeholder={`Search ${SearchPlaceholders[activeTab]}`}
          icon="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          iconProps={{ color: '#8da2b5', size: 14 }}
        />
        <IntentSection setActiveTab={setActiveTab} activeTab={activeTab} />
        <VariablesSection setActiveTab={setActiveTab} activeTab={activeTab} />
        <EntitiesSection setActiveTab={setActiveTab} activeTab={activeTab} />
      </Box>
      <NLUButton>
        <Box display="inline-block" mr={12}>
          <SvgIcon icon="fullExpand" color="#6e849a" />
        </Box>
        Open NLU Manager
      </NLUButton>
    </Container>
  );
};

export default Sidebar;
