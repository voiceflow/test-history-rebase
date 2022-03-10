import { Box, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';

import { Container, NLUButton, SearchInput, SectionsContainer } from './components';
import EntitiesSection from './components/EntitiesSection';
import IntentSection from './components/IntentSection';
import { SectionProps } from './components/types';
import VariablesSection from './components/VariablesSection';

interface SidebarProps {
  setActiveTab: (tab: InteractionModelTabType) => void;
  activeTab: InteractionModelTabType;
  setSelectedItemID: (id: string) => void;
  selectedID: string;
}

const SearchPlaceholders = {
  [InteractionModelTabType.INTENTS]: 'intent',
  [InteractionModelTabType.SLOTS]: 'slot',
  [InteractionModelTabType.VARIABLES]: 'variable',
};

const Sidebar: React.FC<SidebarProps> = ({ selectedID, activeTab, setActiveTab, setSelectedItemID }) => {
  const [search, setSearch] = React.useState('');
  const [searchLength, setSearchLength] = React.useState(0);

  const resetSearch = () => {
    setSearch('');
  };

  useDidUpdateEffect(() => {
    resetSearch();
  }, [activeTab]);

  const sectionProps: SectionProps = {
    setActiveTab,
    selectedID,
    activeTab,
    setSelectedItemID,
    search,
    setSearchLength,
  };

  return (
    <Container>
      <SearchInput
        placeholder={`Search ${searchLength} ${SearchPlaceholders[activeTab]}${searchLength === 1 ? '' : 's'}`}
        icon="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        iconProps={{ color: '#8da2b5', size: 14 }}
      />
      <SectionsContainer activeTab={activeTab}>
        <IntentSection {...sectionProps} />
        <EntitiesSection {...sectionProps} />
        <VariablesSection {...sectionProps} />
      </SectionsContainer>
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
