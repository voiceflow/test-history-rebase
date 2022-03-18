import { Box, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { InteractionModelTabType } from '@/constants';
import { useFeature } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';

import { Container, NLUButton, SearchInput, SectionsContainer } from './components';
import EntitiesSection from './components/EntitiesSection';
import IntentSection from './components/IntentSection';
import { SectionProps } from './components/types';
import VariablesSection from './components/VariablesSection';

const SearchPlaceholders = {
  [InteractionModelTabType.INTENTS]: 'intent',
  [InteractionModelTabType.SLOTS]: 'slot',
  [InteractionModelTabType.VARIABLES]: 'variable',
};

const Sidebar: React.FC = () => {
  const { setTitle } = React.useContext(NLUQuickViewContext);
  const { activeTab, setActiveTab, selectedID, setSelectedID, isActiveItemRename, setIsActiveItemRename } = React.useContext(NLUQuickViewContext);
  const nluManager = useFeature(FeatureFlag.NLU_MANAGER);

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
    setTitle,
    activeTab,
    setSelectedItemID: setSelectedID,
    search,
    setSearchLength,
    isActiveItemRename,
    setIsActiveItemRename,
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
      {nluManager.isEnabled && (
        <NLUButton>
          <Box display="inline-block" mr={12}>
            <SvgIcon icon="fullExpand" color="#6e849a" />
          </Box>
          Open NLU Manager
        </NLUButton>
      )}
    </Container>
  );
};

export default Sidebar;
