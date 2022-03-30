import { Box, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { InteractionModelTabType } from '@/constants';
import { useFeature } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';

import { Container, NLUButton, SearchInput, SectionsContainer } from './components';
import EntitiesList from './components/EntitiesList';
import IntentList from './components/IntentList';
import { SectionProps } from './components/types';
import VariablesList from './components/VariablesList';

const SearchPlaceholders = {
  [InteractionModelTabType.INTENTS]: {
    single: 'intent',
    plural: 'intents',
  },
  [InteractionModelTabType.SLOTS]: {
    single: 'entity',
    plural: 'entities',
  },
  [InteractionModelTabType.VARIABLES]: {
    single: 'variable',
    plural: 'variables',
  },
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
        placeholder={`Search ${searchLength} ${searchLength === 1 ? SearchPlaceholders[activeTab].single : SearchPlaceholders[activeTab].plural}`}
        icon="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        iconProps={{ color: '#8da2b5', size: 14 }}
      />
      <SectionsContainer activeTab={activeTab}>
        <IntentList {...sectionProps} />
        <EntitiesList {...sectionProps} />
        <VariablesList {...sectionProps} />
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
