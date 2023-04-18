import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SvgIcon, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { NLUManagerOpenedOrigin } from '@/ducks/tracking/constants';
import { useDispatch, useFeature } from '@/hooks';
import { NLUQuickViewContext } from '@/ModalsV2/modals/NLU/QuickView/context';

import EntitiesList from './components/EntitiesList';
import IntentList from './components/IntentList';
import { Container, HeaderSearchInput, NLUButton, SectionsContainer } from './components/styles';
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

interface SidebarProps {
  onClose: VoidFunction;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { setTitle } = React.useContext(NLUQuickViewContext);
  const { activeTab, setActiveTab, selectedID, setSelectedID, isActiveItemRename, setIsActiveItemRename } = React.useContext(NLUQuickViewContext);
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);
  const goToNLUManager = useDispatch(Router.goToCurrentNLUManager);

  const [search, setSearch] = React.useState('');
  const [searchLength, setSearchLength] = React.useState(0);

  const resetSearch = () => {
    setSearch('');
  };

  const onGoToNLUManager = () => {
    goToNLUManager(NLUManagerOpenedOrigin.QUICKVIEW);
    onClose();
  };

  useDidUpdateEffect(() => {
    resetSearch();
  }, [activeTab]);

  const sectionProps: SectionProps = {
    search,
    setTitle,
    activeTab,
    selectedID,
    setActiveTab,
    setSearchLength,
    setSelectedItemID: setSelectedID,
    isActiveItemRename,
    setIsActiveItemRename,
  };

  return (
    <Container>
      <HeaderSearchInput
        icon="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        iconProps={{ color: '#8da2b5', size: 14 }}
        borderLess
        placeholder={`Search ${searchLength} ${searchLength === 1 ? SearchPlaceholders[activeTab].single : SearchPlaceholders[activeTab].plural}`}
      />

      <SectionsContainer activeTab={activeTab}>
        <IntentList {...sectionProps} />
        <EntitiesList {...sectionProps} />
        <VariablesList {...sectionProps} />
      </SectionsContainer>

      {nluManager.isEnabled && (
        <NLUButton onClick={onGoToNLUManager}>
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
