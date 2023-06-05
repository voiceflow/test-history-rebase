import React from 'react';

import { LibraryStepType, TabData } from '../constants';
import Searchbar from '../Search';
import Tabs from '../Tabs';
import { LibrarySections } from './types';
import { sortByName } from './utils';

export const useLibrarySubMenuTabs = ({ librarySections }: { librarySections: LibrarySections }) => {
  const { templates } = librarySections;

  // Define the current tabs
  const tabsData = React.useMemo<{ tabType: LibraryStepType; label: string }[]>(
    () => [{ tabType: LibraryStepType.BLOCK_TEMPLATES, label: 'Templates' }],
    []
  );

  // Determine the current tab and retrieve its list of items
  const {
    currentTabData: currentTabSteps,
    currentTab,
    setCurrentTab,
  } = Tabs.useTabs<LibraryStepType, TabData>({
    tabToDataMap: {
      [LibraryStepType.BLOCK_TEMPLATES]: templates,
    },
    defaultTab: LibraryStepType.BLOCK_TEMPLATES,
  });

  // Show the search bar if the current tab has > 6 items (before any search filters)
  const SEARCHBAR_VISIBILITY_THRESHOLD = 6;
  const showSearchbar = currentTabSteps.length > SEARCHBAR_VISIBILITY_THRESHOLD;

  // Filter out items that don't fit our search query
  const { filteredItems, searchText, setSearchText, cancelSearch } = Searchbar.useSearch<TabData>({
    searchItems: currentTabSteps,
    filterPredicate: showSearchbar ? (step, searchText) => step.name.includes(searchText) : () => true,
  });

  // Sort the list of items
  const processedTabItems = React.useMemo(() => filteredItems.sort(sortByName), [filteredItems]);

  return {
    currentTab,
    setCurrentTab,
    tabsData,
    processedTabItems,
    showSearchbar,
    searchText,
    setSearchText,
    cancelSearch,
  };
};
