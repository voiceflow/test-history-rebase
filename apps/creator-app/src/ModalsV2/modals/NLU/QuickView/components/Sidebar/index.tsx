import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUQuickViewContext } from '@/ModalsV2/modals/NLU/QuickView/context';

import { Container, HeaderSearchInput, SectionsContainer } from './components/styles';
import { SectionProps } from './components/types';
import VariablesList from './components/VariablesList';

const SearchPlaceholders = {
  [InteractionModelTabType.VARIABLES]: {
    single: 'variable',
    plural: 'variables',
  },
};

interface SidebarProps {
  onClose: VoidFunction;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { setTitle } = React.useContext(NLUQuickViewContext);
  const { activeTab, setActiveTab, selectedID, setSelectedID, isActiveItemRename, setIsActiveItemRename } = React.useContext(NLUQuickViewContext);

  const [search, setSearch] = React.useState('');
  const [searchLength, setSearchLength] = React.useState(0);

  const resetSearch = () => {
    setSearch('');
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
        <VariablesList {...sectionProps} />
      </SectionsContainer>
    </Container>
  );
};

export default Sidebar;
