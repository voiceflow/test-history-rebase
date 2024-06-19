import React from 'react';

import { useDeferredSearch } from '@/hooks/search.hook';

import { LibraryStepType, TabData } from '../constants';
import Tabs from '../Tabs';
import { LibrarySections } from './types';

export const useLibrarySubMenuTabs = ({ librarySections }: { librarySections: LibrarySections }) => {
  const { templates, customBlocks } = librarySections;

  // Define the current tabs
  const tabsData = React.useMemo<{ tabType: LibraryStepType; label: string }[]>(
    () => [
      { tabType: LibraryStepType.BLOCK_TEMPLATES, label: 'Templates' },
      { tabType: LibraryStepType.CUSTOM_BLOCK, label: 'Custom' },
    ],
    []
  );

  // Determine the current tab and retrieve its list of items
  const {
    currentTabData: currentTabSteps,
    currentTab,
    setCurrentTab,
  } = Tabs.useTabs<LibraryStepType, TabData>({
    tabToDataMap: {
      [LibraryStepType.CUSTOM_BLOCK]: customBlocks,
      [LibraryStepType.BLOCK_TEMPLATES]: templates,
    },
    defaultTab: LibraryStepType.BLOCK_TEMPLATES,
  });

  // Show the search bar if the current tab has > 6 items (before any search filters)
  const SEARCHBAR_VISIBILITY_THRESHOLD = 6;
  const showSearchbar = currentTabSteps.length > SEARCHBAR_VISIBILITY_THRESHOLD;

  const search = useDeferredSearch({
    items: currentTabSteps,
    searchBy: (item) => item.name,
  });

  // Sort the list of items
  const processedTabItems = React.useMemo(
    () => search.items.sort((a, b) => a.name.localeCompare(b.name)),
    [search.items]
  );

  return {
    currentTab,
    setCurrentTab,
    tabsData,
    processedTabItems,
    showSearchbar,
    searchText: search.value,
    setSearchText: search.setValue,
    cancelSearch: () => search.setValue(''),
  };
};
